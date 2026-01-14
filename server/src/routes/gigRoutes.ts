import express from "express";
import { createGig, getAllGigs, getGigById, getMyGigs } from "../controllers/gigController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(authenticateUser, createGig)
  .get(getAllGigs);

router.get("/my-gigs", authenticateUser, getMyGigs);
router.get("/:id", getGigById);

export default router;
