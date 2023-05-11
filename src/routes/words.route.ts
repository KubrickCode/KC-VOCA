import express from "express";
import {
  createWords,
  deleteWords,
  getWords,
  renameWords,
  moveWords,
  changeStats,
  updateRecentView,
} from "../controllers/words.controller";

const router = express.Router();

router.get("/:id", getWords);
router.post("/", createWords);
router.patch("/move", moveWords);
router.patch("/status/:id", changeStats);
router.patch("/recent/:id", updateRecentView);
router.patch("/:id", renameWords);
router.delete("/:id", deleteWords);

export default router;