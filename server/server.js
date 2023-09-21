const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5050;
const { Pool } = require("pg");

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
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
  } catch (error) {
    console.error("Error executing sql post query ", error);
    res.status(500).json({ error: "An error occured while posting new store" });
  }
});

//GET store 1 Categories
app.get("/store1-category", async (req, res) => {
  try {
    const result = await db.query(`SELECT * from category where store_id=${1}`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error to get categories per store", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET store 2 Categories
app.get("/store2-category", async (req, res) => {
  try {
    const result = await db.query(`SELECT * from category where store_id=${2}`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error to get categories per store", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET store 1 items
app.get("/store1-items", async (req, res) => {
  try {
    const storeID = 1;
    const queryText = `
      SELECT i.id AS item_id, i.name AS item_name, i.img AS item_img, i.price AS item_price,
             c.id AS category_id, c.name AS category_name, c.img AS category_img
      FROM item AS i
      INNER JOIN category AS c ON i.category_id = c.id
      WHERE c.store_id = $1;
    `;
    const result = await db.query(queryText, [storeID]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error to get items per store", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET store 2 items
app.get("/store2-items", async (req, res) => {
  try {
    const storeID = 2;
    const queryText = `
      SELECT i.id AS item_id, i.name AS item_name, i.img AS item_img, i.price AS item_price,
             c.id AS category_id, c.name AS category_name, c.img AS category_img
      FROM item AS i
      INNER JOIN category AS c ON i.category_id = c.id
      WHERE c.store_id = $1;
    `;
    const result = await db.query(queryText, [storeID]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error to get items per store", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log("Server running on port ", port);
});