import express from "express";
import cors from "cors";
//import records from "./routes/record.js";
import { loginUser, registerUser, authenticateUser } from "./auth.js";
import mongoose from "mongoose";
import cardService from "./services/card-service.js";
import dotenv from "dotenv";
import path from 'path'
import multer from 'multer'

// TODO: remove and separate into cardservice
import Card from "./models/trading_card.js";
import User from "./models/user.js";

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
  const card = await Card.findById(req.params.cardId)
  
  if (!card) return res.status(404).json({ message: 'Card not found' })
  if (card.status === 'sold') return res.status(400).json({ message: 'Card already sold' })
  if (card.ownerId.toString() === req.user.userId) return res.status(400).json({ message: 'Cannot buy your own card' })

  const buyer = await User.findById(req.user.userId)
  const seller = await User.findById(card.ownerId)

  if (buyer.balance < card.price) return res.status(400).json({ message: 'Insufficient balance' })

  // Update necessary fields for buyer, seller, and card
  buyer.balance -= card.price
  seller.balance += card.price
  card.status = 'sold'
  card.purchasedBy = req.user.userId

  // Save updates
  await buyer.save()
  await seller.save()
  await card.save()

  res.status(200).json({ message: 'Purchase successful', balance: buyer.balance })
})
// Retrieve user balance
app.get('/users/me/balance', authenticateUser, async (req, res) => {
  const user = await User.findById(req.user.userId)
  res.json({ balance: user.balance })
})
// Update user balance
app.patch('/users/me/balance', authenticateUser, async (req, res) => {
  const user = await User.findById(req.user.userId)
  user.balance = req.body.balance
  await user.save()
  res.json({ balance: user.balance })
})
// Relist a card the user has purchased (move from collection back to marketplace)
app.patch('/cards/:id/relist', authenticateUser, async (req, res) => {
  const card = await Card.findById(req.params.id)

  if (!card) return res.status(404).json({ message: 'Card not found' })
  if (card.purchasedBy?.toString() !== req.user.userId) return res.status(403).json({ message: 'Not authorized' })

  card.status = 'market'
  card.purchasedBy = null
  card.ownerId = req.user.userId

  await card.save()
  res.json(card)
})


// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});