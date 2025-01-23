import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dishName: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        isAddon: {
            type: Boolean,
            default: false,
        },
        subscriberNotes: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Cancelled"],
            default: "Pending",
        },
    },
	{ timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);