const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Configure body parsing middleware

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5050;
const { Pool } = require("pg");

const db = new Pool({
  user: process.env.DB_USER,
  host: "surus.db.elephantsql.com",
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.get("/", async (req, res) => {
  try {
    res.send("Full Stack Challenge database");
  } catch {
    console.error("Internal Server Error ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//GET all stores
app.get("/store", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM store");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res
      .status(500)
      .json({ error: "An error occurred while displaying all stores" });
  }
});

//POST store
app.post("/store", async (req, res) => {
  try {
    // console.log(req.body);
    const { name, logo_url } = req.body;
    if (!name || !logo_url) {
      return res.status(400).json({ error: "Name and logo are required." });
    }

    // SQL query to insert a new store
    const queryText = `
      INSERT INTO store (name, logo_url)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [name, logo_url];

    const { rows } = await db.query(queryText, values);

    res.json({ message: "Store created successfully", store: rows[0] });
  } catch (error) {
    console.error("Error executing sql post query ", error);
    res
      .status(500)
      .json({ error: "An error occurred while posting new store" });
  }
});

//GET store 1 Categories
app.get("/store/:storeID/category", async (req, res) => {
  try {
    const storeID = Number(req.params.storeID);
    const result = await db.query(`SELECT * from category where store_id=$1`, [
      storeID,
    ]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error to get categories per store", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//POST store 1 Category
app.post("/store/:storeID/category", async (req, res) => {
  try {
    const storeID = Number(req.params.storeID);
    const { name, img } = req.body;
    if (!name || !img) {
      return res.status(400).json({ error: "Name and img are required." });
    }

    // SQL query to insert a new store
    const queryText =
      "INSERT INTO category (name, img, store_id) VALUES ($1, $2, $3) RETURNING *;";

    const { rows } = await db.query(queryText, [name, img, storeID]);

    res.json({ message: "Store created successfully", store: rows[0] });
  } catch (error) {
    console.error("Error to get categories per store", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET store/category items
app.get("/store/:storeID/:categoryId", async (req, res) => {
  try {
    const storeID = Number(req.params.storeID);
    const categoryID = Number(req.params.categoryId);
    const queryText = `
     SELECT item.id, item.name, item.img, item.price from item inner JOIN category ON item.category_id = category.id where  category.store_id = $1 AND category.id=$2;         
    `;
    const result = await db.query(queryText, [storeID, categoryID]);
    res.json(result.rows);
    console.log(result);
  } catch (error) {
    console.error("Error to get items per store", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//POST store/category 1 items
app.post("/category/:categoryId", async (req, res) => {
  try {
    const categoryID = Number(req.params.categoryId);
    const { name, img, price } = req.body;
    const queryText =
      "INSERT INTO item (name, img, price, category_id) values ($1, $2, $3, $4) RETURNING *";
    const { rows } = await db.query(queryText, [name, img, price, categoryID]);
    res.json({ message: "Store created successfully", store: rows[0] });
  } catch (error) {
    console.error("Error to get items per store", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log("Server running on port ", port);
});
