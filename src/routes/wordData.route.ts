import express from "express";
import {
  createWordData,
  deleteWordData,
  getWordData,
  updateWordData,
} from "../controllers/wordData.controller";

const router = express.Router();

router.get("/:id", getWordData);
router.post("/", createWordData);
router.patch("/:id", updateWordData);
router.delete("/:id", deleteWordData);

export default router;
