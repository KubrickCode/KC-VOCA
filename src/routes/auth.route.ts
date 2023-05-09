import express from "express";
import { login, addUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);
router.post("/signup", addUser);

export default router;
