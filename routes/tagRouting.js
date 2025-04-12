const express = require("express");
const router = express.Router();
const { Tag } = require("../models");

router.post("/create", async (req, res) => {
  try {
    const tag = await Tag.create({
      ...req.body,
      UserId: req.user.id 
    });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/list", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      where: { UserId: req.user.id } 
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: { 
        id: req.params.id, 
        UserId: req.user.id 
      }
    });
    
    if (!tag) return res.status(404).json({ error: "Tag não encontrada" });
    await tag.update(req.body);
    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: { 
        id: req.params.id, 
        UserId: req.user.id 
      }
    });
    
    if (!tag) return res.status(404).json({ error: "Tag não encontrada" });
    await tag.destroy();
    res.json({ message: "Tag removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;