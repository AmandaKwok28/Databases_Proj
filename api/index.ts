import express from "express";
import { pool } from "./db.ts";
import cors from "cors";
import { buildVisualizationQuery } from "./scripts/sql-builder.js";


const app = express();

app.use(cors({
  origin: "*", // or "http://localhost:5173" for tighter security
}));

app.use(express.json());
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
    const result = await pool.query("SELECT * FROM Countries")
    res.json({
      data: result.rows,
    })
  } catch (e) {
    console.error("Error fetching race:", e);
    res.status(500).json({ error: "Internal server error" });
  }
})


// plotting
app.post("/visualize", async (req, res) => {
  const { x, y, groupBy } = req.body;

  try {
    const { query, xLabel, yLabel, groupLabel } = buildVisualizationQuery({ x, y, groupBy });
    const result = await pool.query(query);
    res.json({ 
      data: result.rows, 
      xLabel,
      yLabel,
      groupLabel
    });
  } catch (error) {
    console.error("Visualization error:", error);
    res.status(500).json({ error: "Invalid visualization request" });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
