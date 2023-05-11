import express from "express";
import { login, addUser, findPassword } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);
router.post("/signup", addUser);
router.post("/find-password", findPassword);

export default router;
