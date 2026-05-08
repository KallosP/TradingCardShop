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

export default {
	addCard,
	getAllCards,
	getCardsByUserId
};
