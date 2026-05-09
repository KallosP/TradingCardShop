import { get } from "mongoose";
import cardModel from "../models/trading_card.js";

function addCard(cardData) {
	const cardToAdd = new cardModel(cardData);
	const promise = cardToAdd.save();
	return promise;
}

function getAllCards(userId) {
	// return card data with User schema's data included (specifying only username to be returned)
	return cardModel.find({
		status: "market",
		ownerId: { $ne: userId }
	}).populate("ownerId", "username");
}

// Get cards the user has created and listed on the marketplace
function getUserCardListings(userId) {
	return cardModel.find({ ownerId: userId, status: "market" }).populate("ownerId", "username");
}

// Get cards the user owns/has purchased
function getUserCardCollection(userId) {
	return cardModel.find({ purchasedBy: userId }).populate("ownerId", "username");
}

function updateCard(cardId, cardUpdates){
	// return updated document
	return cardModel.findByIdAndUpdate(cardId, cardUpdates, {returnDocument: 'after'})
}

function deleteCard(cardId) {	
	return cardModel.findByIdAndDelete(cardId)
}

export default {
	addCard,
	getAllCards,
	getUserCardListings,
	getUserCardCollection,
	updateCard,
	deleteCard
};
