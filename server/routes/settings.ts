import express from "express";
import { getUser, updateUser } from "../controllers/settingsController.js";
const router = express.Router();

// Secret key for JWT
//const JWT_SECRET = process.env.JWT_SECRET;

router.get("/settings", getUser);

router.post("/settings", updateUser);

export default router;