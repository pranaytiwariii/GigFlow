import express from "express";
import { createGig, getAllGigs } from "../controllers/gigController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(authenticateUser, createGig)
  .get(getAllGigs);

export default router;
