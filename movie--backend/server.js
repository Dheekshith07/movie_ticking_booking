const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DB CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "movie_booking"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("Connected to MySQL");
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  let { email, password } = req.body;

  // Clean input
  email = email.trim().toLowerCase();
  password = password.trim();

  console.log("LOGIN INPUT:", email);

  db.query(
    "SELECT * FROM Customer WHERE LOWER(TRIM(Cust_Email)) = ?",
    [email],
    (err, result) => {
      console.log("DB RESULT:", result);

      if (err) {
        console.log(err);
        return res.json({ message: "Server error" });
      }

      if (result.length === 0) {
        return res.json({ message: "User not found" });
      }

      if (result[0].Password === password) {
        return res.json({
          message: "Login successful",
          userId: result[0].Cust_ID
        });
      }

      res.json({ message: "Wrong password" });
    }
  );
});

// ================= MOVIES =================
app.get("/movies", (req, res) => {
  db.query("SELECT * FROM Movie", (err, result) => {
    res.json(result);
  });
});

// ================= BRANCHES =================
app.get("/branches", (req, res) => {
  db.query("SELECT * FROM Branch", (err, result) => {
    res.json(result);
  });
});

// ================= BOOKING =================
app.post("/reserve", (req, res) => {
  const { seat, row, tickets, screen, custId, date, time, branchId } = req.body;

  console.log("BOOKING DATA:", req.body); // 👈 see what frontend sends

  const sql = `
    INSERT INTO Reservation 
    (Seat_Number, Row_Code, Total_Tickets, Screen_Number, Status, Cust_ID, Date, Time, Branch_ID)
    VALUES (?, ?, ?, ?, 'Booked', ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [seat, row, tickets, screen, custId, date, time, branchId],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err); // 👈 THIS tells exact problem
        return res.json({ message: "Booking failed" });
      }
      res.json({ message: "Booking successful" });
    }
  );
});app.post("/reserve", (req, res) => {
  const { seat, row, tickets, screen, custId, date, time, branchId } = req.body;

  const sql = `
    INSERT INTO Reservation 
    (Seat_Number, Row_Code, Total_Tickets, Screen_Number, Status, Cust_ID, Date, Time, Branch_ID)
    VALUES (?, ?, ?, ?, 'Booked', ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [seat, row, tickets, screen, custId, date, time, branchId],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Booking failed" });
      }
      res.json({ message: "Booking successful" });
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});