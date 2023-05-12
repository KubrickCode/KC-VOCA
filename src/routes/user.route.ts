import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { validateDto } from "../middlewares/validateDto";
import { deleteUserDto, updateUserDto } from "../dto/user.dto";

const router = express.Router();

router.get("/", getUser);
router.patch("/", validateDto(updateUserDto), updateUser);
router.post("/", validateDto(deleteUserDto), deleteUser);

export default router;
