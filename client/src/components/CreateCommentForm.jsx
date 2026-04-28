import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import commentService from '../services/comments'

const CraeteCommentForm = ({ blogId }) => {
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const createCommentMutation = useMutation({
    mutationFn: async ({ blogId, content }) => {
      const response = await commentService.createNew(blogId, content)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blogs']
      })
    },
    onError: (e) => {
      console.error(e)
    }
  })

  const handleCreate = async event => {
    event.preventDefault()
    createCommentMutation.mutate({ blogId, content: comment })
    setComment('')
  }

  return (
    <form onSubmit={handleCreate}>
      <input
        type="text"
        value={comment}
        onChange={event => setComment(event.target.value)}
      />
      <button type="submit">
        add comment
      </button>
    </form>
  )
}

export default CraeteCommentForm