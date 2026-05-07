import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userService from "./services/user-service.js";

function generateAccessToken(email) {
	return new Promise((resolve, reject) => {
		jwt.sign({email: email}, process.env.TOKEN_SECRET, {expiresIn: "1d"}, (error, token) => {
			if (error) {
				reject(error);
			} else {
				resolve(token);
			}
		});
	});
}

export function registerUser(req, res) {
    const {username, email, password} = req.body;

   	const promise = userService.findUser(email);

    promise.then((retrievedUser) => {
      // Validate input data
      if (!username || !password || !email) {
        res.status(400).send("Bad request: Invalid input data.");
      // If retrievedUser = true, a user already exists with same username
      } else if (retrievedUser) {
        res.status(409).send("A user with this email already exists");
      // Create new user and store hashed password if all validation checks pass
      } else {
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(password, salt)) // hash/salt password
          .then((hashedPassword) => {
            return generateAccessToken(email)
              .then((token) => {
                userService.addUser(username, email, hashedPassword)
                    .then((user) => {
                        console.log("USR", user)
                        res.status(200).send({token: token, userId: user._id, 
                            username: user.username, email: user.email});
                    });
              });
          });
      }
    });
}

export function authenticateUser(req, res, next) {
	const authHeader = req.headers["authorization"];
	//Getting the 2nd part of the auth header (the token)
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		console.log("No token received");
		res.status(401).end();
	} else {
		jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
			if (decoded) {
				next();
			} else {
				console.log("JWT error:", error);
				res.status(401).end();
			}
		});
	}
}

export function loginUser(req, res) {
	const {username, pwd} = req.body; // from form
	// FIXME: Change to find user with their ID instead of username?
	//		 - b/c what if there's two users with same name
	const promise = credService.findUser(username);

	promise
		.then((retrievedUser) => {
			if (!retrievedUser) {
				// invalid username
				res.status(401).send("Unauthorized");
			} else {
				bcrypt
					.compare(pwd, retrievedUser.hashedPassword)
					.then((matched) => {
						if (matched) {
							generateAccessToken(username).then((token) => {
								// User's token and their credentials ID
								res.status(200).send({token: token, userCredId: retrievedUser._id});
							});
						} else {
							// invalid password
							res.status(401).send("Unauthorized");
						}
					})
					.catch(() => {
						res.status(401).send("Unauthorized");
					});
			}
		})
		.catch(() => {
			res.status(400).send("Something went wrong with finding user...");
		});
}
