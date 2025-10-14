import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER || 'er.santosh.upadhyay@gmail.com',
    pass: process.env.EMAIL_PASS || 'zsjs hxyb vtry xgav',
  },
});
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not  exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // checking user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      otp:1234
    });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const emailVerify = async (req, res) => {
  const { email, otp } = req.body;
  const user = await userModel.findOne({ email });
  // const email = user.email;
  if (user.otp !== otp) {
    return res.json({ success: false, message: "Invalid OTP" });
  }
  user.isVerified = true;
  user.otp = null;
  await user.save();
  res.json({ success: true, message: "Email verified successfully" });
};

// otp based authentication

const otpGen = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not exists" });
    }
    // generate OTP and send to user email
    const otp = Math.floor(Math.random() * 1000000).toString();
    const updatedUser = await userModel.findByIdAndUpdate(
                user._id,
                { $set: { otp: otp } }, // Use $set to update only the 'name' property
                { new: true } // Return the updated document
            );

      
    // send otp to user email using nodemailer
    const info=await transporter.sendMail({
      from: '<er.santosh.upadhyay@gmail.com>',
      to: email,
      // to: "user.santosh.here@gmail.com",
      subject: "Hello ✔",
      text: `Hello world? ${otp}`, // plain‑text body
      html: `<b>Hello world?${otp}${email}</b>`, // HTML body
    });
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// verify otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not exists" });
    }
    if (user.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    user.otp = undefined;
    await user.save();
    //
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const profile = async(req,res)=>{
  const {userId} = req.body; 
  const user = await userModel.findById(userId);
  if(!user){
    return res.json({ success: false, message: "User not exists" });
  }
  return res.json({success:true,user})
}

const isverified = async(req,res)=>{
  const {userId} = req.body; 
  const user = await userModel.findById(userId);
  if(!user){
    return res.json({ success: false, message: "User not exists" });
  }
  return res.json({success:true,isVerified:user.isVerified})
}
export {
  loginUser,
  registerUser,
  adminLogin,
  otpGen,
  verifyOtp,
  emailVerify,
  // otpGen1,
  isverified,
  profile
};
