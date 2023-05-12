import express from "express";
import {
  createWords,
  deleteWords,
  getWords,
  renameWords,
  moveWords,
  changeStatus,
  updateRecentView,
} from "../controllers/words.controller";
import { validateDto } from "../middlewares/validateDto";
import {
  changeStatusDto,
  createWordsDto,
  renameWordsDto,
} from "../dto/words.dto";

const router = express.Router();

router.get("/:id", getWords);
router.post("/", validateDto(createWordsDto), createWords);
router.patch("/move", moveWords);
router.patch("/status/:id", validateDto(changeStatusDto), changeStatus);
router.patch("/recent/:id", updateRecentView);
router.patch("/:id", validateDto(renameWordsDto), renameWords);
router.delete("/:id", deleteWords);

export default router;
