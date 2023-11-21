import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByListing,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/comments", verifyToken, createComment);
router.get("/comments/:listingId", getCommentsByListing);
router.delete("/comments/:commentId", verifyToken, deleteComment)

export default router;
