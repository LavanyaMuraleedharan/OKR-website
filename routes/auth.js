const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

router.post("/add-task", userController.createOKRAjax);
router.get("/get-okrs", userController.getOKRs);

router.get("/get-okrs", (req, res) => {
  const userId = req.session.userId;
  db.query(
    "SELECT title, progress FROM okrs WHERE assigned_to = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.json({ success: false });
      }
      res.json({ success: true, okrs: results });
    }
  );
});

module.exports = router;
