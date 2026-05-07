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

export default {
    findUser,
	addUser
};
