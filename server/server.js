import express from "express";
import cors from "cors";
//import records from "./routes/record.js";
import { registerUser } from "./auth.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

// Connect to database using mongoose
mongoose.set("debug", true);
mongoose
	.connect(process.env.ATLAS_URI, {
    dbName: "tcs",
  })
	.then(() => console.log("Connected"))
	.catch((error) => {
		console.log(error);
	});

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.post("/signup", registerUser);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});