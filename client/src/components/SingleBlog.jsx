import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UserContext from './UserContext'
import Comments from './Comments'
import { Button } from './ui/Button'

const SingleBlog = ({ blogs, likeMutation, deleteMutation }) => {
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const blog = blogs.find(b => b.id === id)

  // Safety check for undefined blog
  if (!blog) return <div className="text-center py-10 text-gray-500">Blog not found.</div>

  const isOwner = user && blog.user.username === user.username

  const updateLike = () => {
    likeMutation.mutate({
      id: blog.id,
      likes: blog.likes + 1,
      token: user.token
    })
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteMutation.mutate({ id: blog.id, token: user.token })
      navigate('/blogs')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Blog Hero Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-12">
        <div className="p-8 md:p-12">
          <header className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-xl text-gray-500 font-medium">by {blog.author}</p>
          </header>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <a
              href={blog.url}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium underline decoration-2 underline-offset-4 transition-colors"
            >
              Visit Source →
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
              Added by <span className="font-semibold">{blog.user.name}</span>
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-50 pt-6">
            {/* Likes Section */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-900">{blog.likes}</span>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Likes</span>
              </div>
              <Button
                onClick={updateLike}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-full shadow-md transition-transform active:scale-95"
              >
                👍 Like
              </Button>
            </div>

            {/* Actions */}
            {isOwner && (
              <Button
                onClick={deleteBlog}
                className="bg-red-50 text-red-600 hover:bg-red-100 border-none px-4 py-2 rounded-lg transition-colors"
              >
                Delete Post
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <Comments comments={blog.comments} blogId={blog.id} />
      </div>
    </div>
  )
}

export default SingleBlog