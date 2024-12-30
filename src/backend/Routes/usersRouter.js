const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../todoDB/todo_db.js");

const usersRouter = express.Router();
const blacklist = new Set();

usersRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      !password ||
      typeof password !== "string" ||
      !email ||
      typeof email !== "string"
    ) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows, fields] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

usersRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const [rows, fields] = await db.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const user = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { userID: user.id },
      "1931ede33d43ee32f5741be45bfce3dc3f80a39a77f5283863ae48b650212b87",
      { expiresIn: "8h" }
    );
    const userID = user.id;
    res.json({ token, userID });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access Denied!" });
  }
  try {
    const splitToken = token.split(" ")[1];

    if (blacklist.has(splitToken)) {
      return res.status(401).json({ message: "Token has been blacklisted" });
    }

    const decoded = jwt.verify(
      splitToken,
      "1931ede33d43ee32f5741be45bfce3dc3f80a39a77f5283863ae48b650212b87"
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid Token" });
  }
}

usersRouter.get("/userInfo", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;
    const [rows, fields] = await db.execute(
      `SELECT * FROM users WHERE id = ?`,
      [userID]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.json({ user: rows[0] });
  } catch (error) {
    console.error("Error fetching user Info:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

usersRouter.post("/logout", (req, res) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  const splitToken = token.split(" ")[1];
  blacklist.add(splitToken);

  res.json({ message: "Logged out successfully" });
});

usersRouter.get("/verifyToken", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

module.exports = usersRouter;
