import mongoose from "mongoose";

const TradingCardSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
        description: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            trim: true
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // allows for referencing User data (like username)
            required: true,
        },
        status: {
            type: String,
            enum: ["market", "sold"],
            default: "market",
        },
        purchasedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null 
        }
	},
	{collection: "trading_card"}
);

const TradingCard = mongoose.model("TradingCard", TradingCardSchema);

export default TradingCard;
