import type { Request, Response } from "express";
import Gig from "../models/Gig.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const createGig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, budget } = req.body;
    
    if (!title || !description || !budget) {
      res.status(400).json({ message: "Please provide all values" });
      return;
    }

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.userId,
    });

    res.status(201).json({ gig });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getAllGigs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    
    const queryObject: any = {
      status: "open",
    };

    if (search) {
      queryObject.title = { $regex: search, $options: "i" };
    }

    const gigs = await Gig.find(queryObject).sort("-createdAt").populate("ownerId", "name email");
    
    res.status(200).json({ count: gigs.length, gigs });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
