import express from "express";
import {
  login,
  addUser,
  findPassword,
  googleLogin,
  googleCallback,
  kakaoLogin,
  kakaoCallback,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);
router.post("/signup", addUser);
router.post("/find-password", findPassword);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/kakao", kakaoLogin);
router.get("/kakao/callback", kakaoCallback);

export default router;
