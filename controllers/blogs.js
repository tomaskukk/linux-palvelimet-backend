const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = request => {
  const authorization = request.get("Authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1 });
  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog.toJSON());
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  console.log(body);
  const token = getTokenFrom(request);
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      content: body.content,
      date: new Date(),
      user: user._id
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    content: body.content
  };
  const currentBlog = await Blog.findById(request.params.id);
  const oldContent = currentBlog.content;
  const newBlog = blog.content;
  const arrayOfBlogs = [...newBlog, ...oldContent];

  const newBlogToSave = {
    content: arrayOfBlogs
  };

  console.log(arrayOfBlogs);
  Blog.findByIdAndUpdate(request.params.id, newBlogToSave, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON());
    })
    .catch(error => next(error));
});

module.exports = blogsRouter;
