const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Download linux to hp pavilion",
    content: [
      {
        title: "Getting the ISO image",
        content: "Go to ubuntu official site.. ",
        img: ["somepic.jpeg", "otherpic.png"]
      },
      {
        title: "Download rufus",
        content: "Transpile the ISO image to bootable"
      }
    ]
  },
  {
    title: "Downloading vscode to ubuntu",
    content: [
      {
        title: "Do to vscode.com..",
        content: "Follow these instructions ",
        img: ["vscode.jpeg", "extensions.png"]
      },
      {
        title: "dpkg the file",
        content: "Unpack the package.. "
      }
    ]
  }
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
};
