const Comment = require("../models/comment")
const Blog = require("../models/blog")

const commentRouter = require("express").Router()

commentRouter.post("/:id", async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id)
  const comment = new Comment({...body, blog: blog._id})
  const res = await comment.save()
  blog.comments = blog.comments.concat(res._id)
  await blog.save()

  response.status(201).json(res)
})

module.exports = commentRouter