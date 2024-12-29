require("dotenv").config();

const express = require("express");
const todosRouter = require("./Routes/todosRouter");
const usersRouter = require("./Routes/usersRouter");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", usersRouter);
app.use("/api/todos", todosRouter);

app.listen(3004);
