const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const data = require("./data.json");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  typeCast: function (field, next) {
    if (field.type == "NEWDECIMAL") {
      return parseFloat(field.string());
    }
    return next();
  },
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
// console.log(connection);
// async function setUsers() {
//   const { image, name, username } = data["currentUser"];
//   await connection.promise().query(`USE ${process.env.DB_NAME}`);
//   await connection.promise().execute({
//     sql: "INSERT INTO `users` (`image`, `name`, `username`) VALUES (?, ?, ?)",
//     values: [image, name, username],
//   });
// }
// setUsers();

// const productRequests = data["productRequests"];

// productRequests.forEach(
//   ({ id, title, category, upvotes, status, description, comments }) => {
//     const query =
//       "INSERT INTO `product_requests`(id, title, category, upvotes, status, description, comments, liked) VALUES (?, ?, ?, ?,?,?,?, ? )";
//     connection.execute({
//       sql: query,
//       values: [
//         id,
//         title,
//         category,
//         upvotes,
//         status,
//         description,
//         comments ?? null,
//         false,
//       ],
//     });
//   }
// );

const allowedOrigins = ["http://127.0.0.1:5500"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
