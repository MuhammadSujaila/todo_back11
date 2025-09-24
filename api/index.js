// Import necessary libraries
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Atlas connection (Updated URI)
mongoose.connect('mongodb+srv://sarim:sarim@cluster0.xbmxkcs.mongodb.net/todoapp?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

// Todo Model
const Todo = mongoose.model('Todo', todoSchema);

// Routes

// 1. GET /todos - Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve todos' });
  }
});
app.get("/" , (req, res) => res.send("Congrats Rehan API is running..."));
// 2. POST /todos - Create a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const newTodo = new Todo({
      text,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create todo' });
  }
});

// 3. PUT /todos/:id - Update a todo by id
app.put('/todos/:id', async (req, res) => {
  const { text, completed } = req.body;
  const { id } = req.params;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, { text, completed }, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

// 4. DELETE /todos/:id - Delete a todo by id
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
