const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("../utils/list_helper");
const User = require("../models/user");

const api = supertest(app);

const initialBlogs = [
  {
    title: "test",
    author: "michel",
    url: "foo.com/test",
    likes: 3,
  },
  {
    title: "HTML is easy",
    author: "who?",
    url: "bar.com/product",
    like: 2,
  },
];

const initialUser = [
  {
    username: "test",
    password: "123456",
  },
];

describe("test /api/blogs route", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const userToSave = await Promise.all(
      initialUser.map(async (user) => {
        return { ...user, passwordHash: await bcrypt.hash(user.password, 10) };
      }),
    );

    for (const user of userToSave) {
      let userObject = new User(user);
      await userObject.save();
    }

    const response = await api.post("/api/login").send(initialUser[0]);

    for (const blog of initialBlogs) {
      await api
        .post("/api/blogs")
        .send(blog)
        .set("Authorization", "Bearer " + response.body.token);
    }
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are retured", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("unique identifier property has been transformed from _id to id", async () => {
    const response = await api.get("/api/blogs");

    assert("id" in response.body[0]);
    assert(!("_id" in response.body[0]));
  });

  test("add a new blog", async () => {
    const newBlog = {
      title: "brand new!",
      author: "me",
      url: "fullstackopen.com",
      like: 5,
    };

    const res = await api.post("/api/login").send(initialUser[0]);

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", "Bearer " + res.body.token)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const titles = response.body.map((blog) => blog.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);

    assert(titles.includes("brand new!"));
  });

  test("likes default to 0 if not supplied", async () => {
    const newBlog = {
      title: "brand new!",
      author: "me",
      url: "fullstackopen.com",
    };

    const res = await api.post("/api/login").send(initialUser[0]);

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", "Bearer " + res.body.token)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    for (const blog of response.body) {
      if (blog.title === "brand new!") {
        assert.strictEqual(blog.likes, 0);
        break;
      }
    }
  });

  test("fails with status code 400 if blog entry doesn't have title or url", async () => {
    const newBlogWithoutTitle = {
      author: "me",
      url: "fullstackopen.com",
    };

    const newBlogWithoutURL = {
      title: "brand new!",
      author: "me",
    };

    const res = await api.post("/api/login").send(initialUser[0]);

    await api
      .post("/api/blogs")
      .send(newBlogWithoutTitle)
      .set("Authorization", "Bearer " + res.body.token)
      .expect(400);

    await api
      .post("/api/blogs")
      .send(newBlogWithoutURL)
      .set("Authorization", "Bearer " + res.body.token)
      .expect(400);
  });

  test("deletes a blog and returns status code 204", async () => {
    const blogsAtFirst = await helper.blogsInDb();
    const blogToDelete = blogsAtFirst[0];

    const res = await api.post("/api/login").send(initialUser[0]);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", "Bearer " + res.body.token)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    const titles = blogsAtEnd.map((blog) => blog.title);
    assert(!titles.includes(blogToDelete.title));
    assert.strictEqual(blogsAtEnd.length, blogsAtFirst.length - 1);
  });

  test("updates a blog", async () => {
    const blogsAtFirst = await helper.blogsInDb();
    const blogToUpdate = { ...blogsAtFirst[0], likes: 10 };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd[0].likes, 10);
    assert.strictEqual(blogsAtEnd.length, blogsAtFirst.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
