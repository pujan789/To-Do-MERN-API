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

app.use(express.json())
app.use(cors({ origin: 'https://6557399b22ce8c025206d017--candid-cactus-34cd32.netlify.app' }));




mongoose.connect(`${process.env.MONGODB_URL}`).then(() => console.log("connected to db"))
.catch(console.error)



app.get("/todos",  async (req, res) => {
    const todos = await Todo.find();
    res.json(todos)
});

app.post("/todo/new",  (req,res) => {
  const todo = new Todo({
    text: req.body.text,
    priority: req.body.priority
  })

  todo.save();  

  res.json(todo)
})

app.delete("/todo/delete/:id", async (req,res) => {
  const result = await Todo.deleteOne({_id: req.params.id});
  res.json(result);
})


app.patch("/todo/complete/:id", async (req,res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;
  todo.save();

  res.json(todo);
})



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});




