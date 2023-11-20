import express from "express";
import {
  saveSearch,
  getRecommendations,
} from "../controllers/search.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/save", verifyToken, saveSearch);
router.get("/recommendations", verifyToken, getRecommendations);

export default router;
