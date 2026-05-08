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
        }
	},
	{collection: "trading_card"}
);

const TradingCard = mongoose.model("TradingCard", TradingCardSchema);

export default TradingCard;
