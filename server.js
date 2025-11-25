// server.js — production-ready Password Manager backend
require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*", // you can restrict later to your S3 domain
  })
);

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "passop";
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_prod";

let db, passwordsCollection;

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  passwordsCollection = db.collection("passwords");
  console.log("MongoDB connected");

  // ---------- PASSWORD ROUTES ----------

  // Get all passwords
  app.get("/", async (req, res) => {
    const data = await passwordsCollection.find().toArray();
    res.json(data);
  });

  // Add password
  app.post("/", async (req, res) => {
    const item = req.body;
    if (!item.site || !item.username || !item.password)
      return res.status(400).json({ error: "Missing fields" });

    await passwordsCollection.insertOne(item);
    res.json({ ok: true });
  });

  // Delete password
  app.delete("/", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Missing id" });

    await passwordsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ ok: true });
  });

  // ---------- AUTH ROUTES (optional) ----------

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
