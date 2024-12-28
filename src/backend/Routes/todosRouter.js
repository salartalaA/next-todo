const express = require("express");
const todo_db = require("../todoDB/todo_db");

const todosRouter = express.Router();

todosRouter.get("/", async (req, res) => {
  try {
    const [rows] = await todo_db.query("SELECT * FROM todos");
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

todosRouter.post("/", async (req, res) => {
  const { text } = req.body;
  if (typeof text !== "string") {
    return res.status(400).send({ error: "Invalid Input data" });
  }
  try {
    const query = "INSERT INTO todos (text) VALUES (?)";
    const [result] = await todo_db.query(query, [text]);

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
    const query = `DELETE FROM todos WHERE id = ${todoID}`;
    const [result] = await todo_db.query(query, [todoID]);

    res
      .status(201)
      .send({ message: "Todo deleted successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = todosRouter;
