import cardModel from "../models/trading_card.js";

function addCard(cardData) {
  const cardToAdd = new cardModel(cardData);
  return cardToAdd.save();
}

function getAllCards(userId) {
  return cardModel.find({
    status: "market"
  }).populate("ownerId", "username");
}

function getUserCardListings(userId) {
  return cardModel.find({ ownerId: userId, status: "market" }).populate("ownerId", "username");
}

function getUserCardCollection(userId) {
  return cardModel.find({ purchasedBy: userId }).populate("ownerId", "username");
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
  card.status = 'sold';
  card.purchasedBy = buyerId;
  return card.save();
}

async function relistCard(card, userId) {
  card.status = 'market';
  card.purchasedBy = null;
  card.ownerId = userId;
  return card.save();
}

export default {
  addCard,
  getAllCards,
  getUserCardListings,
  getUserCardCollection,
  updateCard,
  deleteCard,
  findCardById,
  purchaseCard,
  relistCard
};