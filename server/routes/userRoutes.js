import express from "express";
import { getCars, getUserData, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router(); // Creates a User Router by express.Router()

userRouter.post('/register', registerUser); // Calls the registerUser function from userController
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserData);
userRouter.get('/cars', getCars);

export default userRouter; // Exports the userRouter to the server.js