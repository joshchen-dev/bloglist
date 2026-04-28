const Blog = require("../models/blog");
const User = require("../models/user");

const dummy = () => {
  return 1;
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const totalLikes = (blogs) => {
  const reducer = (accumulator, blog) => {
    return accumulator + blog.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  let fav = blogs[0];

  blogs.forEach((blog) => {
    if (blog.likes > fav.likes) {
      fav = blog;
    }
  });

  return fav;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let authorToBlogs = new Map();

  for (const blog of blogs) {
    if (!authorToBlogs.has(blog.author)) {
      authorToBlogs.set(blog.author, 0);
    }
    authorToBlogs.set(blog.author, authorToBlogs.get(blog.author) + 1);
  }

  let theAuthor = blogs[0].author;

  for (const [author, nums] of authorToBlogs) {
    if (nums > authorToBlogs.get(theAuthor)) {
      theAuthor = author;
    }
  }

  return { author: theAuthor, blogs: authorToBlogs.get(theAuthor) };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let authorToLikes = new Map();

  for (const blog of blogs) {
    if (!authorToLikes.has(blog.author)) {
      authorToLikes.set(blog.author, 0);
    }
    authorToLikes.set(blog.author, authorToLikes.get(blog.author) + blog.likes);
  }

  let theAuthor = blogs[0].author;

  for (const [author, nums] of authorToLikes) {
    if (nums > authorToLikes.get(theAuthor)) {
      theAuthor = author;
    }
  }

  return { author: theAuthor, blogs: authorToLikes.get(theAuthor) };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  usersInDb,
};
