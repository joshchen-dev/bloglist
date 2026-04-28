import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import CreateBlogForm from './CreateBlogForm'
import userEvent from '@testing-library/user-event'

test('CreateBlogForm\' handler receives correct details while new blog is created', async () => {
  const blog = {
    author: 'foo',
    id: '123456',
    likes: 3,
    title: 'this is just a test',
    url: 'where to',
    user: {
      id: '123111',
      name: 'bar',
      uesrname: 'ba'
    }
  }

  const blogUser = {
    'token': 'syJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhlbGxhcyIsImlkIjoiNjlhZDM2MmFlYWM3YWQwMTg5ZWZkMjUxIiwiaWF0IjoxNzczOTAzNzA5fQ.tS6d5ztrAJFgCDNrhtDHgR47YSpzG6qgrM-vTTD3o9g',
    'username': 'hellas',
    'name': 'Arto Hellas'
  }

  const newBlog = {
    title: 'this a new blog',
    author: 'author is me',
    url: 'don\'t know'
  }

  const setBlogsMock = vi.fn()
  const showNotificationMock = vi.fn()
  const ref = { current: { toggleVisibility: vi.fn() } }
  const blogService = { uploadBlog: vi.fn() }
  const user = userEvent.setup()

  render(<CreateBlogForm
    user={blogUser}
    blogs={[blog]}
    setBlogs={setBlogsMock}
    showNotification={showNotificationMock}
    ref={ref}
    blogService={blogService}
  />)

  const createButton = screen.getByText('create')
  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)
  await user.click(createButton)

  expect(blogService.uploadBlog.mock.calls[0][0].title).equals('this a new blog')
  expect(blogService.uploadBlog.mock.calls[0][0].author).equals('author is me')
  expect(blogService.uploadBlog.mock.calls[0][0].url).equals('don\'t know')
})