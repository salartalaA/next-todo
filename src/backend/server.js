require("dotenv").config();

const express = require("express");
const todosRouter = require("./Routes/todosRouter");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/todos", todosRouter);

app.listen(3004);
