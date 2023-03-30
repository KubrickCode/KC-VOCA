import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index.jade", { title: "Express" });
});

export default router;
