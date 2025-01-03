const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const data = require("./data.json");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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
const poolPromise = pool.promise();
// code to reinitalize database
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

// List of allowed origins
const allowedOrigins = [
  "https://product-feedback-app-ikpg.onrender.com",
  "https://product-feedback-backend.loca.lt", // Replace with your LocalTunnel or Ngrok URL
];

// CORS options to control which origins, methods, and headers are allowed
const corsOptions = {
  origin: "https://product-feedback-app-ikpg.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "bypass-tunnel-reminder", // Custom headers if necessary
    "localtunnel-agent-ips",
    "Origin",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// For preflight requests (OPTIONS)
app.options("*", cors(corsOptions));
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));

app.get("/data", async (req, res) => {
  try {
    const dataQuery = "Select * from product_requests";
    const userQuery = "Select * from users LIMIT 1";
    const [rows] = await poolPromise.query(dataQuery);
    const [user] = await poolPromise.query(userQuery);

    res.json({ productRequests: rows, currentUser: user[0] });
  } catch (error) {
    console.error(error);
  }
});

app.get("/getPost/:id", async (req, res) => {
  const id = req.params.id;
  const postQuery = `SELECT * FROM ${process.env.DB_PRODUCT_NAME} WHERE id = ? LIMIT 1`;

  const [posts] = await poolPromise.query({ sql: postQuery, values: [id] });
  res.json({ post: posts[0] });
});

app.get("/getPosts/:status", async (req, res) => {
  const status = req.params.status;
  const postsQuery = `SELECT * FROM ${process.env.DB_PRODUCT_NAME} WHERE status = ?`;
  const [posts] = await poolPromise.query({
    sql: postsQuery,
    values: [status],
  });
  res.json({ posts });
});
app.post("/addPost", async (req, res) => {
  const { title, category, upvotes, status, description, liked, comments } =
    req.body;
  const commentsString = JSON.stringify(comments ?? null);
  const query =
    "INSERT INTO `product_requests`(title, category, upvotes, status, description, comments, liked) VALUES ( ?, ?, ?,?,?,?, ? )";
  const [results] = await poolPromise.query({
    sql: query,
    values: [
      title,
      category,
      upvotes,
      status,
      description,
      commentsString,
      liked,
    ],
  });
  res.json({ success: true });
});
app.post("/updatePost/:id", async (req, res) => {
  const id = req.params.id;
  const { title, category, status, description, upvotes, comments, liked } =
    req.body;

  const commentsString = JSON.stringify(comments ?? null);
  const updateQuery = `UPDATE \`${process.env.DB_PRODUCT_NAME}\` SET title = ?, category = ?, status = ?, description = ?, upvotes = ?, comments= ?, liked = ? WHERE id = ?`;
  const [result, error] = await poolPromise.query({
    sql: updateQuery,
    values: [
      title,
      category,
      status,
      description,
      upvotes,
      commentsString,
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
  const [results, error] = await poolPromise.query({
    sql: updateQuery,
    values: [upvotes, liked, id],
  });
  res.json({ success: true, results });
});

app.delete("/deletePost/:id", async (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM \`${process.env.DB_PRODUCT_NAME}\` WHERE id = ? LIMIT 1`;
  const [results, error] = await poolPromise.query({
    sql: deleteQuery,
    values: [id],
  });

  res.json({ success: true });
});

app.get("/health-check", async (req, res) => {
  try {
    const userQuery = "Select 1 from users LIMIT 1";

    const [user] = await poolPromise.query(userQuery);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
