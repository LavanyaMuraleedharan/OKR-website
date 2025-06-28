const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const hbs = require("hbs");
const path = require("path");
const session = require("express-session");

const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
dotenv.config({
  path: "./.env",
});
app.get("/dashboard", (req, res) => {
  res.render("dashboard"); // render dashboard.hbs
});

app.use(
  session({
    secret: "mySecret", // You should store this in .env as SESSION_SECRET
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
});

const location = path.join(__dirname, "./public");
app.use(express.static(location));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use("/", require("./routes/page"));
app.use("/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});
app.get("/home", (req, res) => {
  res.render("home", {
    companyOKRs: [
      {
        objective: "Launch Product X",
        key_result: "Deploy by Q3",
        progress: 75,
      },
      {
        objective: "Grow Customer Base",
        key_result: "Reach 10K users",
        progress: 60,
      },
    ],
  });
});

app.listen(5000, () => {
  console.log("Server Started @ Port 5000");
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("SQL CONNECTED");
  }
});
