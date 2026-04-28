import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let setBlogsMock
  let blogServiceMock

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

  const user = {
    'token': 'syJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhlbGxhcyIsImlkIjoiNjlhZDM2MmFlYWM3YWQwMTg5ZWZkMjUxIiwiaWF0IjoxNzczOTAzNzA5fQ.tS6d5ztrAJFgCDNrhtDHgR47YSpzG6qgrM-vTTD3o9g',
    'username': 'hellas',
    'name': 'Arto Hellas'
  }

  beforeEach(() => {
    setBlogsMock = vi.fn()
    blogServiceMock = { uploadLike: vi.fn() }

    render(<Blog blog={blog} blogs={[blog]} user={user} setBlogs={setBlogsMock} blogService={blogServiceMock} />)
  })

  test('title and author are visible by default', () => {
    const element = screen.getByText('this is just a test ' + 'foo')
    expect(element).toBeVisible()
  })

  test('likes are not visible by default', () => {
    const likes = screen.getByText('likes 3')
    expect(likes).not.toBeVisible()
  })

  test('url are not visible by default', () => {
    const url = screen.getByText('where to')
    expect(url).not.toBeVisible()
  })

  test('after clicking \'view\' button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likes = screen.getByText('likes 3')
    expect(likes).toBeVisible()

    const url = screen.getByText('where to')
    expect(url).toBeVisible()
  })

  test('after clicking \'like\' button twice, the registered handler is called twice', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(blogServiceMock.uploadLike.mock.calls).toHaveLength(2)
  })
})