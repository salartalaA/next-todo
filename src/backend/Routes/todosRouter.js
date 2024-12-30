const express = require("express");
const todo_db = require("../todoDB/todo_db");

const todosRouter = express.Router();

todosRouter.get("/:userID", async (req, res) => {
  const userID = req.params.userID;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await todo_db.query(
      "SELECT * FROM todos WHERE userID = ? LIMIT ? OFFSET ?",
      [userID, limit, offset]
    );

    const [[{ total }]] = await todo_db.query(
      "SELECT COUNT(*) AS total FROM todos WHERE userID = ?",
      [userID]
    );

    res.status(200).send({
      todos: rows,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

todosRouter.post("/:userID", async (req, res) => {
  const userID = req.params.userID;
  const { text } = req.body;
  if (typeof text !== "string") {
    return res.status(400).send({ error: "Invalid Input data" });
  }
  try {
    const query = "INSERT INTO todos (text, userID) VALUES (?, ?)";
    const [result] = await todo_db.query(query, [text, userID]);

    res
      .status(201)
      .send({ message: "Todo added successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

todosRouter.put("/:todoID", async (req, res) => {
  const todoID = req.params.todoID;

  try {
    const query = `UPDATE todos SET isCompleted = !isCompleted WHERE id = ?`;
    const [result] = await todo_db.query(query, [todoID]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: "Todo not found" });
    }

    res
      .status(200)
      .send({ message: "Todo updated successfully", updatedID: todoID });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

todosRouter.delete("/:todoID", async (req, res) => {
  const todoID = req.params.todoID;
  try {
    const query = `DELETE FROM todos WHERE id = ?`;
    const [result] = await todo_db.query(query, [todoID]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: "Todo not found" });
    }

    res.status(200).send({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = todosRouter;
