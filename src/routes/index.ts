import express from "express";
import userRoutes from "./user.route";
import folderRoutes from "./folder.route";
import wordsRoutes from "./words.route";
import wordDataRoutes from "./wordData.route";
import authRoutes from "./auth.route";
import validateToken from "../middlewares/validateToken";

const router = express.Router();

router.use("/user", validateToken, userRoutes);
router.use("/folders", validateToken, folderRoutes);
router.use("/words", validateToken, wordsRoutes);
router.use("/word-data", validateToken, wordDataRoutes);
router.use("/auth", authRoutes);

export default router;
