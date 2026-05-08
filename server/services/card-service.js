import cardModel from "../models/trading_card.js";

function addCard(cardData) {
	const cardToAdd = new cardModel(cardData);
	const promise = cardToAdd.save();
	return promise;
}

function getAllCards() {
	return cardModel.find()
}

function getCardsByUserId(userId) {
	return cardModel.find({ ownerId: userId });
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
	getCardsByUserId,
	updateCard,
	deleteCard
};
