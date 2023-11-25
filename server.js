import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import mongoose from 'mongoose';
import cors from "cors";
import Todo from "./models/Todo.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

// Allow requests from the specified origins, including http://localhost:3000
const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

mongoose.connect(`${process.env.MONGODB_URL}`).then(() => console.log("connected to db"))
  .catch(console.error);

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    priority: req.body.priority,
  });

  todo.save();
  res.json(todo);
});

app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.deleteOne({ _id: req.params.id });
  res.json(result);
});

app.patch("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;
  todo.save();
  res.json(todo);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
