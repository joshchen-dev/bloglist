import { render, screen } from '@testing-library/react'
import { expect, test, vi, beforeEach } from 'vitest'
import CreateBlogForm from './CreateBlogForm'
import userEvent from '@testing-library/user-event'
import React from 'react'
import UserContext from './UserContext'

const testUser = {
  'token': 'syJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhlbGxhcyIsImlkIjoiNjlhZDM2MmFlYWM3YWQwMTg5ZWZkMjUxIiwiaWF0IjoxNzczOTAzNzA5fQ.tS6d5ztrAJFgCDNrhtDHgR47YSpzG6qgrM-vTTD3o9g',
  'username': 'hellas',
  'name': 'Arto Hellas'
}

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useContext: vi.fn((context) => {
      // Return the test user for UserContext
      if (context === UserContext || context.displayName === 'UserContext') {
        return { user: testUser }
      }
      return {}
    }),
  }
})

beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks()
})

test('CreateBlogForm\' handler receives correct details while new blog is created', async () => {
  const newBlog = {
    title: 'this a new blog',
    author: 'author is me',
    url: 'don\'t know'
  }

  const createMutationMock = { mutate: vi.fn() }
  const ref = { current: { toggleVisibility: vi.fn() } }
  const user = userEvent.setup()

  render(
    <CreateBlogForm
      createMutation={createMutationMock}
      ref={ref}
    />
  )

  const createButton = screen.getByText('create')
  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')

  await user.type(titleInput, newBlog.title)
  await user.type(authorInput, newBlog.author)
  await user.type(urlInput, newBlog.url)
  await user.click(createButton)

  expect(createMutationMock.mutate.mock.calls[0][0].content.title).equals('this a new blog')
  expect(createMutationMock.mutate.mock.calls[0][0].content.author).equals('author is me')
  expect(createMutationMock.mutate.mock.calls[0][0].content.url).equals('don\'t know')
})