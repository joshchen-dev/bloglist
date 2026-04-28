const User = require("../models/user");
const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("../utils/list_helper");
const bcrypt = require("bcrypt");

const api = supertest(app);

describe("API test for /api/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("user creation with no username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "hi",
      password: "123123",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect(/`username` is required/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("user creation with short username (< 3 characters)", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "as",
      name: "hi",
      password: "123123",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect(/shorter than the minimum allowed length/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("user creation with no password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "hellas",
      name: "hi",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect(/password missing/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("user creation with short password (< 3 characters)", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "hellas",
      name: "hi",
      password: "12",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect(/password should be at least 3 characters long/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("user creation with already existing user", async () => {
    const usersAtStart = await helper.usersInDb();
    const userToCreate = {
      ...usersAtStart[0],
      password: "123456",
    };

    await api
      .post("/api/users")
      .send(userToCreate)
      .expect(400)
      .expect(/expected `username` to be unique/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
