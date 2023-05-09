import express from "express";
import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/users/:id", getUser);
router.post("/users", addUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
