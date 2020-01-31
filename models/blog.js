const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: String,
  content: [
    {
      title: String,
      content: String,
      img: [String]
    }
  ],
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
