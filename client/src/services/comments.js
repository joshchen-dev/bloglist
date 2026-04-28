import axios from 'axios'

const baseUrl = '/api/comments'

const createNew = async (blogId, content) => {
  const response = await axios.post(baseUrl + `/${blogId}`, { content })
  return response.data
}

export default { createNew }