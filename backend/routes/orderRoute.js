import express from 'express'
import{placeOrder, allOrders, userOrders,updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middlewares/adminAuth.js'
import authUser from '../middlewares/auth.js'
// import PlaceOrder from '../../frontend/src/pages/PlaceOrder.jsx'

const orderRouter = express.Router()
// Admin features 
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// payment features
orderRouter.post('/place',authUser,placeOrder)

// User Feature
orderRouter.post('/userorders',authUser,userOrders)
export default orderRouter