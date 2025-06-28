const express = require("express");
const router = express.Router();
const db = require("../db");
const { isLoggedIn } = require("../controllers/user");

router.get("/create", isLoggedIn, (req, res) => {
  res.render("create-okr", { user: req.user });
});

router.post("/create", isLoggedIn, (req, res) => {
  const { title, description, progress } = req.body;
  const assigned_to = req.user.id;

  db.query(
    "INSERT INTO okrs (title, description, progress, assigned_to) VALUES (?, ?, ?, ?)",
    [title, description, progress, assigned_to],
    (err) => {
      if (err) return res.status(500).send("Failed to add OKR");
      res.redirect("/home");
    }
  );
});

router.get("/edit/:id", isLoggedIn, (req, res) => {
  const okrId = req.params.id;

  db.query("SELECT * FROM okrs WHERE id = ?", [okrId], (err, results) => {
    if (err || results.length === 0) return res.status(404).send("Not found");
    res.render("edit-okr", { okr: results[0] });
  });
});

router.post("/update/:id", isLoggedIn, (req, res) => {
  const okrId = req.params.id;
  const { title, description, progress } = req.body;

  db.query(
    "UPDATE okrs SET title = ?, description = ?, progress = ? WHERE id = ?",
    [title, description, progress, okrId],
    (err) => {
      if (err) return res.status(500).send("Update failed");
      res.redirect("/home");
    }
  );
});

router.post("/delete/:id", isLoggedIn, (req, res) => {
  const okrId = req.params.id;

  db.query("DELETE FROM okrs WHERE id = ?", [okrId], (err) => {
    if (err) return res.status(500).send("Delete failed");
    res.redirect("/home");
  });
});

module.exports = router;
