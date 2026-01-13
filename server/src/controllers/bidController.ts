import type { Response } from "express";
import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const createBid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { gigId, message, price } = req.body;
    const freelancerId = req.user?.userId;

    if (!gigId || !message || !price || !freelancerId) {
      res.status(400).json({ message: "Please provide all values" });
      return;
    }

    const gig: any = await Gig.findById(gigId);
    if (!gig) {
      res.status(404).json({ message: "Gig not found" });
      return;
    }

    if (gig.ownerId.toString() === freelancerId) {
      res.status(400).json({ message: "You cannot bid on your own gig" });
      return;
    }

    if (gig.status !== "open") {
      res.status(400).json({ message: "Gig is no longer open" });
      return;
    }

    const alreadyBid = await Bid.findOne({ gigId: gigId as any, freelancerId: freelancerId as any });
    if (alreadyBid) {
      res.status(400).json({ message: "You have already submitted a bid for this gig" });
      return;
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: freelancerId as any,
      message,
      price,
    });

    res.status(201).json({ bid });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getBidsByGigId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { gigId } = req.params;
    const userId = req.user?.userId;

    const gig: any = await Gig.findById(gigId);
    if (!gig) {
      res.status(404).json({ message: "Gig not found" });
      return;
    }

    if (gig.ownerId.toString() !== userId) {
      res.status(403).json({ message: "Not authorized to view bids for this gig" });
      return;
    }

    const bids = await Bid.find({ gigId: gigId as any })
      .populate("freelancerId", "name email")
      .sort("-createdAt");

    res.status(200).json({ count: bids.length, bids });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const hireFreelancer = async (req: AuthRequest, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;
    const userId = req.user?.userId;

    const bid: any = await Bid.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "Bid not found" });
      return;
    }

    const gig: any = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "Gig associated with this bid not found" });
      return;
    }

    // Authorization: Only owner can hire
    if (gig.ownerId.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      res.status(403).json({ message: "Not authorized to hire for this gig" });
      return;
    }

    // Validation: Check if gig is already assigned
    if (gig.status !== "open") {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: "This gig is already assigned" });
      return;
    }

    // --- ATOMIC UPDATES ---

    // 1. Update Gig status
    gig.status = "assigned";
    await gig.save({ session });

    // 2. Set selected bid to hired
    bid.status = "hired";
    await bid.save({ session });

    // 3. Set all other bids for this gig to rejected
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: "rejected" }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Freelancer hired successfully", gig, bid });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction Aborted:", error);
    res.status(500).json({ message: "Hiring process failed", error });
  }
};
