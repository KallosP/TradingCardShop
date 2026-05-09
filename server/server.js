import express from "express";
import cors from "cors";
//import records from "./routes/record.js";
import { loginUser, registerUser, authenticateUser } from "./auth.js";
import mongoose from "mongoose";
import cardService from "./services/card-service.js";
import userService from "./services/user-service.js";
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
// ------------------------
// Create a new card
app.post("/cards", authenticateUser, upload.single('image'), (req, res) => {
	const cardToAdd = {
    ...req.body,
    ownerId: req.user.userId,
    imageUrl: `/uploads/${req.file.filename}`
  }
	const promise = cardService.addCard(cardToAdd);
	promise.then((newAdd) => res.status(201).json(newAdd)).catch((error) => res.status(500).send());
});
// Get all cards in database
app.get("/cards", authenticateUser, async (req, res) => {
  try{
    const cards = await cardService.getAllCards(req.user.userId);
    res.status(200).json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})
// Get all cards associated with user (listings (for sale) and collection (purchased))
app.get("/cards/me", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listings = await cardService.getUserCardListings(userId);
    const collection = await cardService.getUserCardCollection(userId);
    res.status(200).json({ listings, collection });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
// Update a card with corresponding ID
app.put("/cards/:cardId", authenticateUser, upload.single('image'), async (req, res) => {
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
// Delete a card with corresponding ID
app.delete("/cards/:cardId", authenticateUser, async (req, res) => {
  try{
    const {cardId} = req.params; 
    await cardService.deleteCard(cardId);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})
// Purchase a card
app.post('/cards/:cardId/buy', authenticateUser, async (req, res) => {
  try {
    const card = await cardService.findCardById(req.params.cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' })
    if (card.status === 'sold') return res.status(400).json({ message: 'Card already sold, please refresh for up-to-date listings' })
    if (card.ownerId.toString() === req.user.userId) return res.status(400).json({ message: 'Cannot buy your own card' })
    // Ensure client-provided price matches server price to prevent mismatches due to stale data on client side
    if (req.body.price !== card.price) return res.status(400).json({ message: 'Price mismatch, please refresh the page' }) 

    const buyer = await userService.findUserById(req.user.userId);
    const seller = await userService.findUserById(card.ownerId);

    if (buyer.balance < card.price) return res.status(400).json({ message: 'Insufficient balance' })

    await userService.transferBalance(buyer, seller, card.price);
    await cardService.purchaseCard(card, req.user.userId);

    res.status(200).json({ message: 'Purchase successful', balance: buyer.balance })
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.patch('/cards/:cardId/relist', authenticateUser, async (req, res) => {
  try {
    const card = await cardService.findCardById(req.params.cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' })
    if (card.purchasedBy?.toString() !== req.user.userId) return res.status(403).json({ message: 'Not authorized' })
    const relistedCard = await cardService.relistCard(card, req.user.userId);
    res.status(200).json(relistedCard);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.get('/users/me/balance', authenticateUser, async (req, res) => {
  try {
    const balance = await userService.getBalance(req.user.userId);
    res.status(200).json({ balance });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.patch('/users/me/balance', authenticateUser, async (req, res) => {
  try {
    const user = await userService.updateBalance(req.user.userId, req.body.balance);
    res.status(200).json({ balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});