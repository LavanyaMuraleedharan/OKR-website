const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});

exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return res.render("register", { msg: "Please fill in all fields" });
  }

  if (password !== passwordConfirm) {
    return res.render("register", { msg: "Passwords do not match" });
  }

  if (password.length < 8) {
    return res.render("register", {
      msg: "Password must be at least 8 characters",
    });
  }

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.render("register", { msg: "Database error" });
      if (results.length > 0) {
        return res.render("register", { msg: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO users SET ?",
        { name, email, password: hashedPassword },
        (err) => {
          if (err)
            return res.render("register", { msg: "User registration failed" });
          res.redirect("/login");
        }
      );
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.render("login", { msg: "Enter both fields" });

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (
        !results.length ||
        !(await bcrypt.compare(password, results[0].password))
      ) {
        return res.render("login", { msg: "Email or password is incorrect" });
      }

      const userId = results[0].id;
      req.session.userId = userId;
      req.session.user = results[0];

      db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [userId]);
      res.redirect("/home");
    }
  );
};

exports.createOKRAjax = (req, res) => {
  const { title, progress } = req.body;
  const userId = req.session.userId;

  if (!title || !progress || !userId) {
    return res.json({ success: false, message: "Missing data" });
  }

  const insertQuery =
    "INSERT INTO okrs (title, progress, assigned_to) VALUES (?, ?, ?)";
  db.query(insertQuery, [title, progress, userId], (err) => {
    if (err) {
      console.error("Insert error:", err);
      return res.json({ success: false, message: "Database error" });
    }

    // Fetch updated OKRs to update chart
    const fetchQuery = "SELECT title, progress FROM okrs WHERE assigned_to = ?";
    db.query(fetchQuery, [userId], (err, results) => {
      if (err) return res.json({ success: false });
      res.json({ success: true, okrs: results });
    });
  });
};

exports.getOKRs = (req, res) => {
  const userId = req.session.userId;

  if (!userId) return res.json({ success: false });

  db.query(
    "SELECT title, progress FROM okrs WHERE assigned_to = ?",
    [userId],
    (err, results) => {
      if (err) return res.json({ success: false });
      res.json({ success: true, okrs: results });
    }
  );
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      db.query(
        "SELECT * FROM users WHERE id = ?",
        [decoded.id],
        (err, results) => {
          if (!results.length) return next();
          req.user = results[0];
          return next();
        }
      );
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};
