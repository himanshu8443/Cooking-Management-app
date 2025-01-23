import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		accountType: {
			type: String,
			enum: ["Admin", "Cook", "User"],
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		token: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},

	},
	{ timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);