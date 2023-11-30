import express from "express";
import { createListing, deleteListing, updateListing, getListing, getListings, getNearbyListings } from '../controllers/listing.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.get('/recommendations/:id', getNearbyListings);

export default router;
