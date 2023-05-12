import express from "express";
import {
  getUser,
  deleteUser,
  changeNickname,
  changePassword,
} from "../controllers/user.controller";
import { validateDto } from "../middlewares/validateDto";
import {
  deleteUserDto,
  changeNicknameDto,
  changePasswordDto,
} from "../dto/user.dto";

const router = express.Router();

router.get("/", getUser);
router.patch("/nickname", validateDto(changeNicknameDto), changeNickname);
router.patch("/password", validateDto(changePasswordDto), changePassword);
router.post("/", validateDto(deleteUserDto), deleteUser);

export default router;
