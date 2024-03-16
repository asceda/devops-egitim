"use strict";
const express = require("express");
const pool = require("./helper/postgresql");

const app = express();
app.use(express.json());

//check db connection
pool.connect((err) => {
  if (err) {
    console.log("Database connection error: ", err);
  } else {
    console.log("Database connected");
  }
});

// EKLEME İŞLEMİ
app.post("/student/add", (req, res) => {
  const { name, surname, age } = req.body;

  if (!name || !surname || !age) {
    return res.status(400).json({ error: "Tüm alanlar doldurulmalıdır." });
  }

  const sql = `INSERT INTO students (name, surname, age) VALUES ($1, $2, $3)`;
  const values = [name, surname, age];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.log("Error inserting student: ", err);
      return res.status(500).json({ error: "Öğrenci eklenirken bir hata oluştu." });
    } else {
      console.log("Yeni öğrenci başarıyla eklendi.");
      return res.status(201).json({ message: "Yeni öğrenci başarıyla eklendi." });
    }
  });
});

  // LİSTELEME İŞLEMİ
 app.get("/student", (req, res) => {
  pool.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.log("Database query error: ", err);
    } else {
      res.status(200).json({
        status: "success",
        data: results,
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
