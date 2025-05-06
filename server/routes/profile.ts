import express from "express";
import { loginUser, registerUser } from "../controllers/profileController.js";
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/profile", loginUser);

router.post("/profile", registerUser);

export default router;