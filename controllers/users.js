const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = request => {
  const authorization = request.get("Authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

usersRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;
    console.log(body);
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    });

    const savedUser = await user.save();

    response.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    content: 1,
    date: 1
  });
  response.json(users.map(u => u.toJSON()));
});

usersRouter.get("/blogs", async (request, response) => {
  const token = getTokenFrom(request);
  console.log(token);
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log(decodedToken);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id).populate("blogs", {
      title: 1,
      content: 1,
      date: 1
    });
    console.log(user);
    response.json(user.blogs);
  } catch (exception) {
    console.log(exception);
  }
});

module.exports = usersRouter;
