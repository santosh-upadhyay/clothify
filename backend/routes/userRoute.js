import express from 'express'
import { loginUser,registerUser,adminLogin, emailVerify, verifyOtp, otpGen, profile,isverified } from '../controllers/userController.js'
import authUser from '../middlewares/auth.js';

const userRouter = express.Router();
userRouter.use('/isverified',authUser,isverified);
userRouter.post('/otp',otpGen);
userRouter.post('/verify-otp',verifyOtp);
userRouter.post('/emailVerify',authUser,emailVerify);
// userRouter.post('/email-verifyotp',authUser,otpGen1)
userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/profile',authUser,profile);

export default userRouter;










