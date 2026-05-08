import express from "express";
import cors from "cors";
//import records from "./routes/record.js";
import { loginUser, registerUser, authenticateUser } from "./auth.js";
import mongoose from "mongoose";
import cardService from "./services/card-service.js";
import dotenv from "dotenv";
import path from 'path'
import multer from 'multer'

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

const storage = multer.diskStorage({
  // where images are stored
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  // creating unique image file names (prevent duplicates)
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage: storage})

app.use(cors());
app.use(express.json());
// make server's file system accessible at URL 
app.use('/uploads', express.static('uploads'))

// Authentication
app.post("/signup", registerUser);
app.post("/login", loginUser);

// Trading Card Operations
app.post("/card", authenticateUser, upload.single('image'), (req, res) => {
	const cardToAdd = {
    ...req.body,
    ownerId: req.user.userId,
    imageUrl: `/uploads/${req.file.filename}`
  }
	const promise = cardService.addCard(cardToAdd);
	promise.then((newAdd) => res.status(201).json(newAdd)).catch((error) => res.status(500).send());
});

// Get all cards in database
app.get("/card", async (req, res) => {
  try{
    const cards = await cardService.getAllCards();
    res.status(200).json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})

// Get all cards created by user
app.get("/card/me", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userCards = await cardService.getCardsByUserId(userId);
    console.log("userCards", userCards)
    res.status(200).json(userCards);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// Updates card with corresponding ID
app.put("/card/:cardId", authenticateUser, upload.single('image'), async (req, res) => {
  try{
    const {cardId} = req.params; 
    const cardUpdates = {
      ...req.body,
    };
    // Only update image if new file was uploaded
    if (req.file) {
      cardUpdates.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedCard = await cardService.updateCard(cardId, cardUpdates);
    res.status(200).json(updatedCard);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})

app.delete("/card/:cardId", authenticateUser, async (req, res) => {
  try{
    const {cardId} = req.params; 
    await cardService.deleteCard(cardId);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});