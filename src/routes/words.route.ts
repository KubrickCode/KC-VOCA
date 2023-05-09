import express from "express";
import {
  createWords,
  deleteWords,
  getWords,
  renameWords,
} from "../controllers/words.controller";

const router = express.Router();

router.get("/:id", getWords);
router.post("/", createWords);
router.patch("/:id", renameWords);
router.delete("/:id", deleteWords);

export default router;
