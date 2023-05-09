import express from "express";
import userRoutes from "./user.route";
import folderRoutes from "./folder.route";
import wordsRoutes from "./words.route";
import wordDataRoutes from "./wordData.route";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/folders", folderRoutes);
router.use("/words", wordsRoutes);
router.use("/word-data", wordDataRoutes);

export default router;
