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
    if (
      field.type == "TINYINT" ||
      field.type == "BOOL" ||
      field.type == "TINY"
    ) {
      return field.string() === "1";
    }
    return next();
  },
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
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

app.get("/data", async (req, res) => {
  const dataQuery = "Select * from product_requests";
  const userQuery = "Select * from users LIMIT 1";
  const [rows] = await connection.promise().execute(dataQuery);
  const [user] = await connection.promise().execute(userQuery);

  res.json({ productRequests: rows, currentUser: user[0] });
});

app.get("/getPost/:id", async (req, res) => {
  const id = req.params.id;
  const postQuery = `SELECT * FROM ${process.env.DB_PRODUCT_NAME} WHERE id = ? LIMIT 1`;

  const [posts] = await connection
    .promise()
    .execute({ sql: postQuery, values: [id] });
  res.json({ post: posts[0] });
});

app.get("/getPosts/:status", async (req, res) => {
  const status = req.params.status;
  const postsQuery = `SELECT * FROM ${process.env.DB_PRODUCT_NAME} WHERE status = ?`;
  const [posts] = await connection
    .promise()
    .execute({ sql: postsQuery, values: [status] });
  res.json({ posts });
});
app.post("/addPost", async (req, res) => {
  const { title, category, upvotes, status, description, liked, comments } =
    req.body;
  const query =
    "INSERT INTO `product_requests`(title, category, upvotes, status, description, comments, liked) VALUES ( ?, ?, ?,?,?,?, ? )";
  const [results] = await connection.promise().execute({
    sql: query,
    values: [
      title,
      category,
      upvotes,
      status,
      description,
      comments ?? null,
      liked,
    ],
  });
  res.json({ success: true });
});
app.post("/updatePost/:id", async (req, res) => {
  const id = req.params.id;
  const { title, category, status, description, upvotes, comments, liked } =
    req.body;

  const updateQuery = `UPDATE \`${process.env.DB_PRODUCT_NAME}\` SET title = ?, category = ?, status = ?, description = ?, upvotes = ?, comments= ?, liked = ? WHERE id = ?`;
  const [result, error] = await connection.promise().execute({
    sql: updateQuery,
    values: [
      title,
      category,
      status,
      description,
      upvotes,
      comments ?? null,
      liked,
      id,
    ],
  });
  res.json({ success: true });
});

app.put("/updateLike/:id", async (req, res) => {
  const id = req.params.id;
  const { upvotes, liked } = req.body;
  const updateQuery = `UPDATE \`${process.env.DB_PRODUCT_NAME}\` SET upvotes = ?, liked = ? WHERE id = ?`;
  const [results, error] = await connection.promise().execute({
    sql: updateQuery,
    values: [upvotes, liked, id],
  });
  res.json({ success: true, results });
});

app.delete("/deletePost/:id", async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM \`${process.env.DB_PRODUCT_NAME}\` WHERE id = ? LIMIT 1`;
  const [results, error] = await connection
    .promise()
    .execute({ sql: deleteQuery, values: [id] });

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
