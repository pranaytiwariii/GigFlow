import express from "express";
import { createBid, getBidsByGigId, hireFreelancer } from "../controllers/bidController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createBid);
router.get("/:gigId", authenticateUser, getBidsByGigId);
router.patch("/:bidId/hire", authenticateUser, hireFreelancer);

export default router;
