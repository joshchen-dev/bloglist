const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");
// const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get("/", async (request, response) => {
  const res = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { content: 1 })
  response.json(res);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  const user = await User.findById(request.user);

  if (!user) {
    return response.status(400).json({ error: "userId missing or invalid" });
  }

  const blog = new Blog({ ...body, user: user._id });

  const res = await blog.save();
  user.blogs = user.blogs.concat(res._id);
  await user.save();

  response.status(201).json(res);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog && request.user !== blog.user.toString()) {
    return response
      .status(401)
      .json({ error: "user doesn't have the right to delete this blog" });
  }

  await Blog.deleteOne({ _id: request.params.id });
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedBlog) {
    return response.status(404).end();
  }

  response.json(updatedBlog);
});

module.exports = blogsRouter;
