const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

describe("if there is some blogs already saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogs = helper.initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogs.map(blog => blog.save());
    await Promise.all(promiseArray);
  });

  test("blogs are returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body.length).toBe(helper.initialBlogs.length);
  });

  test("spefic blog can be found within initalblogs", async () => {
    const response = await api.get("/api/blogs");

    const contents = response.body.map(r => r.content);
    expect(contents).toContain("Getting the ISO image");
  });

  describe("viewing a spefici blog", () => {
    test("succeeds with a valid id", async () => {
      const blogsAtBeginning = await helper.blogsInDb();

      const blgoToView = blogsAtBeginning[0];

      const resultBlog = await api
        .get(`/api/blogs/${blgoToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(resultBlog.body).toEqual(blgoToView);
    });
  });

  test("fails with 400 id is invalid", async () => {
    const inavalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/blogs/${inavalidId}`).expect(400);
  });
});
