import { ChevronRightIcon, ExternalLinkIcon } from 'lucide-react'

// import { useContext, useState } from 'react'
import UserContext from './UserContext'
import { Link } from 'react-router-dom'
import { Button } from './ui/Button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

const Blog = ({ blog }) => {
  // const [extend, setExtend] = useState(0)
  // const { user } = useContext(UserContext)
  // const buttonLabels = ['view', 'hide']
  // const showWhenExtended = { display: extend === 1 ? '' : 'none' }
  // const showWhenIsOwner = { display: extend && (blog.user.name === user.name) ? '' : 'none' }

  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5,
  // }

  // const updateLike = () => {
  //   likeMutation.mutate({
  //     id: blog.id,
  //     likes: blog.likes + 1,
  //     token: user.token
  //   })
  // }

  // const deleteBlog = () => {
  //   const yes = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)

  //   if (!yes) {
  //     return
  //   }

  //   deleteMutation.mutate({
  //     id: blog.id,
  //     token: user.token
  //   })
  // }

  return (
    <div className='blog'>
      <div>
        <div className="flex w-full max-w-md flex-col gap-4">
          <Item variant='outline' asChild>
            <Link to={`/blogs/${blog.id}`}>
              <ItemContent>
                <ItemTitle>{blog.title}</ItemTitle>
                <ItemDescription>
                  {blog.author}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon className="size-4" />
              </ItemActions>
            </Link>
          </Item>
          {/* <Item variant="outline" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ItemContent>
                <ItemTitle>External resource</ItemTitle>
                <ItemDescription>
                  Opens in a new tab with security attributes.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ExternalLinkIcon className="size-4" />
              </ItemActions>
            </a>
          </Item> */}
        </div>
      </div>
      {/* <div>
        <Link to={`/blogs/${blog.id}`}>{blog.title + blog.author}</Link>
      </div>
      <div style={showWhenExtended}>
        {blog.url}
      </div>
      <div style={showWhenExtended}>
        likes {blog.likes} <Button onClick={updateLike}>like</Button>
      </div>
      <div style={showWhenExtended}>
        {blog.user.name}
      </div>
      <Button onClick={deleteBlog} style={showWhenIsOwner}>remove</Button> */}
    </div>
  )
}

export default Blog