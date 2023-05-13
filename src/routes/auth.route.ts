import express from "express";
import {
  login,
  addUser,
  findPassword,
  googleLogin,
  googleCallback,
  kakaoLogin,
  kakaoCallback,
  refreshToken,
} from "../controllers/auth.controller";
import { validateDto } from "../middlewares/validateDto";
import { addUserDto, findPasswordDto, loginDto } from "../dto/auth.dto";

const router = express.Router();

router.post("/login", validateDto(loginDto), login);
router.post("/refresh", refreshToken);
router.post("/signup", validateDto(addUserDto), addUser);
router.post("/find-password", validateDto(findPasswordDto), findPassword);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/kakao", kakaoLogin);
router.get("/kakao/callback", kakaoCallback);

export default router;
