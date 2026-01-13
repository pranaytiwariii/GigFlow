import type { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const createJWT = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_LIFETIME || "1d") as any,
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Please provide all values" });
      return;
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const user = await User.create({ name, email, password });
    const token = createJWT(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide all values" });
      return;
    }

    const user: any = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const token = createJWT(user._id.toString());
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "user logged out!" });
};
