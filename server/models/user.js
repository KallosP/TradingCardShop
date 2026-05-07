import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true
		},
        email: {
            type: String,
            required: true,
            trim: true
        },
        hashedPassword: {
            type: String,
            required: true,
            trim: true
        }
	},
	{collection: "user"}
);

const User = mongoose.model("User", UserSchema);

export default User;
