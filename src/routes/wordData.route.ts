import express from "express";
import {
  createWordData,
  deleteWordData,
  getWordData,
  updateWordData,
  ttsService,
  search,
  updateComplete,
} from "../controllers/wordData.controller";
import { validateDto } from "../middlewares/validateDto";
import {
  createWordDataDto,
  searchDto,
  ttsServiceDto,
  updateCompleteDto,
  updateWordDataDto,
} from "../dto/wordData.dto";

const router = express.Router();

router.get("/:id", getWordData);
router.post("/", validateDto(createWordDataDto), createWordData);
router.post("/tts", validateDto(ttsServiceDto), ttsService);
router.post("/search", validateDto(searchDto), search);
router.patch("/complete", validateDto(updateCompleteDto), updateComplete);
router.patch("/:id", validateDto(updateWordDataDto), updateWordData);
router.delete("/:id", deleteWordData);

export default router;
