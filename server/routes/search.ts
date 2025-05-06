import express from "express";
import { searchProduct, searchProductById } from "../controllers/searchController";
import { getSuggestions, updateSearchStats } from "../controllers/searchSuggestionController";
import { debugSearchProductById, debugSearchProducts } from "../controllers/debug/searchControllerDebug";
const DEBUG = process.env.DEBUG === "true"

const router = express.Router();

// Specific routes first
router.get("/suggestions", getSuggestions);
router.post("/stats", updateSearchStats);

// Search routes
if(DEBUG) {
    console.log("Server Debugging Mode")
    router.get("/", debugSearchProducts)
    router.get("/:id", debugSearchProductById);
} else {
    router.get("/", searchProduct);
    router.get("/:id", searchProductById);
}


export default router;