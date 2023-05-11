import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/", getUser);
router.patch("/", updateUser);
router.post("/", deleteUser);

export default router;
