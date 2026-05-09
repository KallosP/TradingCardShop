import userModel from "../models/user.js";

// Attempt to find a user with provided username
function findUser(email){
    return userModel.findOne({email: email});
}

function addUser(username, email, hashedPassword) {
	const userToAdd = new userModel({username, email, hashedPassword});
	const promise = userToAdd.save();
	return promise;
}

function findUserById(userId) {
  return userModel.findById(userId);
}

async function transferBalance(buyer, seller, amount) {
  buyer.balance -= amount;
  seller.balance += amount;
  await buyer.save();
  await seller.save();
}

async function updateBalance(userId, newBalance) {
  const user = await userModel.findById(userId);
  user.balance = newBalance;
  return user.save();
}

async function getBalance(userId) {
  const user = await userModel.findById(userId);
  return user.balance;
}


export default {
    findUser,
	addUser,
	findUserById,
	transferBalance,
	updateBalance,
	getBalance
};
