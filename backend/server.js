const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://root:root@cluster0.wkvkjzg.mongodb.net/myTodoDB?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.log("MongoDB Connection Error: ", err));

const TaskSchema = new mongoose.Schema({ text: String });
const Task = mongoose.model('Task', TaskSchema);

// GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// POST - create a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task({ text: req.body.text });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// PUT - update a task by id
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updated = await Task.findByIdAndUpdate(
            req.params.id,
            { text: req.body.text },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Task not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE - delete a task by id
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
