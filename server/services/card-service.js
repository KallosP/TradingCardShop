import cardModel from "../models/trading_card.js";

function addCard(cardData) {
  const cardToAdd = new cardModel(cardData);
  return cardToAdd.save();
}

function getAllCardsOnMarket(userId) {
  return cardModel.find({
    status: "market"
  }).populate("ownerId", "username");
}

// All cards in listings are on the market
function getUserCardListings(userId) {
  return cardModel.find({ ownerId: userId, status: "market" }).populate("ownerId", "username");
}

// All cards in collection are off the market
function getUserCardCollection(userId) {
  return cardModel.find({ ownerId: userId, status: "offmarket" }).populate("ownerId", "username");
}

function updateCard(cardId, cardUpdates) {
  return cardModel.findByIdAndUpdate(cardId, cardUpdates, { returnDocument: 'after' });
}

function deleteCard(cardId) {
  return cardModel.findByIdAndDelete(cardId);
}

function findCardById(cardId) {
  return cardModel.findById(cardId);
}

async function purchaseCard(card, buyerId) {
  card.status = 'offmarket';
  card.ownerId = buyerId; // buyer becomes the owner
  return card.save();
}

async function relistCard(card) {
  card.status = 'market';
  return card.save();
}

async function delistCard(card) {
	card.status = 'offmarket';
	return card.save();
}

export default {
  addCard,
  getAllCardsOnMarket,
  getUserCardListings,
  getUserCardCollection,
  updateCard,
  deleteCard,
  findCardById,
  purchaseCard,
  relistCard,
  delistCard
};