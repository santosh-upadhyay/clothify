// npm i cors dotenv express jsonwebtoken mongoose multer 
// nodemon razorpay stripe validator cloudinary bcrypt 
import express from "express";
import cors from 'cors'

// import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCoudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import dotenv from "dotenv"
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
dotenv.config({
    path: './.env'
})

//app config
const app = express()

const port = process.env.PORT || 4000

// In serverless environments (Vercel) we must not start a listener with app.listen.
// Also guard connection attempts so missing environment variables don't crash the function on import.
;(async () => {
    try {
        if (process.env.MONGODB_URI) {
            await connectDB()
        } else {
            console.warn('MONGODB_URI not set - skipping DB connection')
        }
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err && err.message ? err.message : err)
    }

    try {
        // cloudinary config relies on env vars - it doesn't strictly need to await, but keep for parity
        await connectCoudinary()
    } catch (err) {
        console.error('Failed to configure Cloudinary:', err && err.message ? err.message : err)
    }
})()

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}));
// whatever req we get pass using json

const corsConfig = {
    // In development you can use '*' or localhost. In production, set this to your frontend origin(s).
    origin: process.env.CORS_ORIGIN || '*',
    // note: the option name expected by the cors middleware is 'credentials'
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization", "token"],
}

// Handle preflight requests for all routes with the configured CORS options.
app.options('*', cors(corsConfig))
app.use(cors(corsConfig));

app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order',orderRouter)
app.get('/',(req,res)=>{
    res.send("API WORKING")
})

// Only start listening when running locally (not on Vercel serverless functions)
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log('Server started on PORT :' + port);
    })
}

// Export the app for serverless platforms (Vercel will use this as the function handler)
export default app




