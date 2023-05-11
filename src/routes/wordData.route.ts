import express from "express";
import {
  createWordData,
  deleteWordData,
  getWordData,
  updateWordData,
  ttsService,
} from "../controllers/wordData.controller";

const router = express.Router();

router.get("/:id", getWordData);
router.post("/", createWordData);
router.post("/tts", ttsService);
router.patch("/:id", updateWordData);
router.delete("/:id", deleteWordData);

export default router;
