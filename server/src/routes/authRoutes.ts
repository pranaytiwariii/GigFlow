import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { authenticateUser, type AuthRequest } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import type { Response } from "express";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Example protected route to verify authentication
router.get("/me", authenticateUser, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.userId).select('-password');
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ id: user._id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
});

export default router;
