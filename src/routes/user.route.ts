import express from "express";
import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/:id", getUser);
router.post("/", addUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
