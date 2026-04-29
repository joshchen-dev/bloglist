import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

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
      if (context.displayName === 'UserContext') {
        return { user: testUser }
      }
      return {}
    }),
  }
})

describe('<Blog />', () => {
  let likeMutationMock
  let deleteMutationMock

  const blog = {
    author: 'foo',
    id: '123456',
    likes: 3,
    title: 'this is just a test',
    url: 'where to',
    user: {
      id: '123111',
      name: 'Arto Hellas',
      uesrname: 'ba'
    }
  }

  beforeEach(() => {
    likeMutationMock = { mutate: vi.fn() }
    deleteMutationMock = { mutate: vi.fn() }

    render(
      <BrowserRouter>
        <Blog blog={blog} likeMutation={likeMutationMock} deleteMutation={deleteMutationMock} />
      </BrowserRouter>
    )
  })

  test('title and author are visible by default', () => {
    const titleElement = screen.getByText('this is just a test')
    const authorElement = screen.getByText('foo')
    expect(titleElement).toBeVisible()
    expect(authorElement).toBeVisible()
  })

  test('blog is rendered as a link to the blog detail page', () => {
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blogs/123456')
  })
})