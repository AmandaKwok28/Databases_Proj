import express from "express";
import { pool } from "./db.ts";


const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});


// get a list of all institutions
app.get("/institutions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Institutions");
    res.json({
      data: result.rows
    });
  } catch (e) {
    console.error("Error fetching institutions:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});



// author
app.get("/authors", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Author")
    res.json({
      data: result.rows,
    })
  } catch (e) {
    console.error("Error fetching authors:", e);
    res.status(500).json({ error: "Internal server error" });
  }
})


// race
app.get("/race", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Race")
    res.json({
      data: result.rows,
    })
  } catch (e) {
    console.error("Error fetching race:", e);
    res.status(500).json({ error: "Internal server error" });
  }
})


// gender
app.get("/gender", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Gender")
    res.json({
      data: result.rows,
    })
  } catch (e) {
    console.error("Error fetching race:", e);
    res.status(500).json({ error: "Internal server error" });
  }
})


// journals
app.get("/journals", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Journals")
    res.json({
      data: result.rows,
    })
  } catch (e) {
    console.error("Error fetching race:", e);
    res.status(500).json({ error: "Internal server error" });
  }
})


// articles
app.get("/articles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Articles")
    res.json({
      data: result.rows,
    })
  } catch (e) {
    console.error("Error fetching race:", e);
    res.status(500).json({ error: "Internal server error" });
  }
})


// countries
app.get("/country", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Country")
    res.json({
      data: result.rows,
    })
  } catch (e) {
    console.error("Error fetching race:", e);
    res.status(500).json({ error: "Internal server error" });
  }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
