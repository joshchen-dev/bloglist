import { useState, useEffect, useRef, useContext } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import LogoutButton from './components/LogoutButton'
import blogService from './services/blogs'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Toggable from './components/Toggable'
import { useNotification } from './hooks/helper'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import UserContext from './components/UserContext'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import AllUsers from './components/AllUsers'
import SingleUser from './components/SingleUser'
import SingleBlog from './components/SingleBlog'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './components/ui/navigation-menu'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { user, userDispatch } = useContext(UserContext)
  const setNotification = useNotification()
  const queryClient = useQueryClient()

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: async ({ content, token }) => {
      const response = await blogService.uploadBlog(content, token)
      return response
    },
    onSuccess: (newBlog) => {
      const blogsBefore = queryClient.getQueryData(['blogs'])
      const updatedBlogs = blogsBefore.concat({ ...newBlog, user })
      queryClient.setQueryData(['blogs'], updatedBlogs)
      setNotification('success', `a new blog ${newBlog.title} by ${newBlog.author} added`)
    },
    onError: () => {
      setNotification('error', 'failed to create new blog')
    }
  })

  const likeMutation = useMutation({
    mutationFn: async ({ id, likes, token }) => {
      const response = await blogService.uploadLike(id, likes, token)
      return response
    },
    onSuccess: (newBlog) => {
      const blogsBefore = queryClient.getQueryData(['blogs'])
      const updatedBlogs = blogsBefore.map(blog => blog.id === newBlog.id
        ? { ...blog, likes: newBlog.likes }
        : blog
      ).toSorted((a, b) => b.likes - a.likes)
      queryClient.setQueryData(['blogs'], updatedBlogs)
    },
    onError: (e) => {
      console.error(e)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ id, token }) => {
      await blogService.deleteBlog(id, token)
      return id
    },
    onSuccess: (id) => {
      const blogsBefore = queryClient.getQueryData(['blogs'])
      const blogsAfter = blogsBefore.filter(blog => blog.id !== id)
      queryClient.setQueryData(['blogs'], blogsAfter)
    },
    onError: (e) => {
      console.error(e)
    }
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'LOGIN',
        payload: user
      })
    }
  }, [])

  const blogFormRef = useRef()

  if (blogsQuery.isPending) {
    return (
      <h1>Loading now...</h1>
    )
  }

  const blogs = blogsQuery.data

  if (user === null) {
    return (
      <Router>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} showNotification={setNotification} />
      </Router>
    )
  }

  const homePageContent = (
    <div>
      <div className='container mx-auto'>
        <h2 className='text-3xl font-bold'>Blogs</h2>
      </div>
      {/* <h2>create new</h2> */}
      <Toggable targetLabel='create new blog' ref={blogFormRef}>
        <CreateBlogForm
          blogs={blogs}
          createMutation={createMutation}
          showNotification={setNotification}
          ref={blogFormRef}
          blogService={blogService}
        />
      </Toggable>
      <div>
        {user && blogs.map((blog) =>
          <Blog
            key={blog.id}
            blog={blog}
            blogs={blogs}
            blogService={blogService}
            likeMutation={likeMutation}
            deleteMutation={deleteMutation}
          />
        )}
      </div>

    </div>
  )

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to={'/blogs'} style={padding}>blogs</Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to={'/users'} style={padding}>users</Link>
            </NavigationMenuLink>
            {user.name} logged in
          </NavigationMenuItem>
          <div>
            <LogoutButton user={user} />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
      {/* <div style={{ backgroundColor: 'rgba(114, 113, 67, 0.31)' }}>
        <Link to={'/blogs'} style={padding}>blogs</Link>
        <Link to={'/users'} style={padding}>users</Link>
        {user.name} logged in
        <LogoutButton user={user} />
      </div> */}
      <div className='flex items-center justify-center'>
        <Notification />
        <div>
          <div>
          </div>
        </div>
        <Routes>
          <Route path='/users' element={<AllUsers />} />
          <Route path='/blogs' element={homePageContent} />
          <Route path='/users/:id' element={<SingleUser />} />
          <Route path='/blogs/:id' element={<SingleBlog blogs={blogs} likeMutation={likeMutation} deleteMutation={deleteMutation} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App