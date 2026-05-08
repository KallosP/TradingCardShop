import cardModel from "../models/trading_card.js";

function addCard(cardData) {
	const cardToAdd = new cardModel(cardData);
	const promise = cardToAdd.save();
	return promise;
}

function getAllCards() {
	return cardModel.find()
}

export default {
	addCard,
	getAllCards
};
