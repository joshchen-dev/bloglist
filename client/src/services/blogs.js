import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl)
    return response.data
  } catch (e) {
    console.error(e)
    return e
  }
}

const uploadNote = async (postData, token) => {
  const response = await axios.post(baseUrl, postData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

const uploadLike = async (id, likes, token) => {
  const body = { likes: likes }
  const response = await axios.put(baseUrl + `/${id}`, body, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

const deleteBlog = async (id, token) => {
  const response = await axios.delete(baseUrl + `/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export default { getAll, uploadBlog: uploadNote, uploadLike, deleteBlog }