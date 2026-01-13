import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: 1000,
    },
    budget: {
      type: Number,
      required: [true, "Please provide a budget"],
      min: 0,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "assigned"],
      default: "open",
    },
  },
  { timestamps: true }
);

// Index for search
gigSchema.index({ title: "text" });

const Gig = mongoose.model("Gig", gigSchema);

export default Gig;
