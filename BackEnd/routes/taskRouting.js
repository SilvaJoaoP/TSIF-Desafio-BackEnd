const express = require("express");
const router = express.Router();
const { Task, Tag } = require("../models");

router.post("/create", async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      UserId: req.user.id 
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/list", async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { UserId: req.user.id } 
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/list/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id, 
        UserId: req.user.id
      }
    });
    
    if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id, 
        UserId: req.user.id
      }
    });
    
    if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id, 
        UserId: req.user.id 
      }
    });
    
    if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
    await task.destroy();
    res.json({ message: "Tarefa removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/add/:taskId/tags", async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.taskId, 
        UserId: req.user.id 
      }
    });
    
    if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

    const tags = await Tag.findAll({
      where: {
        id: req.body.tagIds,
        UserId: req.user.id
      },
    });

    await task.setTags(tags);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;