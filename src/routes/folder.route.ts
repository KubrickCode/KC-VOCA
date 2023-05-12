import express from "express";
import {
  createFolder,
  deleteFolder,
  getFolders,
  renameFolder,
  moveFolder,
} from "../controllers/folder.controller";
import { validateDto } from "../middlewares/validateDto";
import { createFolderDto, renameFolderDto } from "../dto/folder.dto";

const router = express.Router();

router.get("/", getFolders);
router.post("/", validateDto(createFolderDto), createFolder);
router.patch("/move", moveFolder);
router.patch("/:id", validateDto(renameFolderDto), renameFolder);
router.delete("/:id", deleteFolder);

export default router;
