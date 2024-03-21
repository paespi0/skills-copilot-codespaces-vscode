// Create web server and listen on port 3000
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Comment = require("./comment");

app.use(bodyParser.json());

// Connect to the database
mongoose.connect("mongodb://localhost:27017/comments");

// Get all comments
app.get("/comments", async (req, res) => {
  const comments = await Comment.find();
  res.json(comments);
});

// Get comment by ID
app.get("/comments/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  res.json(comment);
});

// Add a new comment
app.post("/comments", async (req, res) => {
  const comment = new Comment({
    username: req.body.username,
    content: req.body.content,
    date: new Date(),
  });

  const savedComment = await comment.save();
  res.json(savedComment);
});

// Update a comment by ID
app.put("/comments/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  comment.username = req.body.username;
  comment.content = req.body.content;
  comment.date = new Date();

  const savedComment = await comment.save();
  res.json(savedComment);
});

// Delete a comment by ID
app.delete("/comments/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  const deletedComment = await comment.remove();
  res.json(deletedComment);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

# 5. Create a React app

```bash
# Create a new React app
npx create-react-app client
cd client
```

# 6. Add a form to add a comment

```jsx
// Path: client/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/comments").then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = async () => {
    const new