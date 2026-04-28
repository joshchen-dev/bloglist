import { useContext, useState } from 'react'
import UserContext from './UserContext'
import { Button } from './ui/Button'

const CreateBlogForm = ({ createMutation, ref }) => {
  const { user } = useContext(UserContext)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async event => {
    event.preventDefault()

    const request = { title, author, url }
    createMutation.mutate({ content: request, token: user.token })
    ref.current.toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleCreate}>
      <div>
        <label>
          title:
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <Button type="submit">create</Button>
    </form>
  )
}

export default CreateBlogForm