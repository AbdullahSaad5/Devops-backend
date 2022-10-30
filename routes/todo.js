const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { Todo } = require("../models");
const verifyJWT = require("../middlewares/jwt-verify");

// Add Todo
router.post("/add", verifyJWT, async (req, res, next) => {
  try {
    const { title, description } = req.body;
    console.log(req.body);
    const todo = await Todo.create({
      userID: req.userId,
      title,
      description,
      status: false,
    });
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// Get all Todos
router.get("/", verifyJWT, async (req, res, next) => {
  try {
    const todos = await Todo.findAll({
      where: {
        userID: req.userId,
      },
    });
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// Delete Todo
router.delete("/delete/:id", verifyJWT, async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        userID: req.userId,
      },
    });

    if (!todo) {
      return res.json({ message: "Todo not found" });
    }

    await todo.destroy();
    res.json({ message: "Todo deleted" });
  } catch (err) {
    next(err);
  }
});

// Update Todo
router.put("/update/:id", verifyJWT, async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        userID: req.userId,
      },
    });

    if (!todo) {
      return res.json({ message: "Todo not found" });
    }

    const { title, description, status } = req.body;
    await todo.update({
      title,
      description,
      status,
    });
    res.json(todo);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
