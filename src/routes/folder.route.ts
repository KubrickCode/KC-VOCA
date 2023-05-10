import express from "express";
import {
  createFolder,
  deleteFolder,
  getFolders,
  renameFolder,
  moveFolder,
} from "../controllers/folder.controller";

const router = express.Router();

router.get("/", getFolders);
router.post("/", createFolder);
router.patch("/move", moveFolder);
router.patch("/:id", renameFolder);
router.delete("/:id", deleteFolder);

export default router;
