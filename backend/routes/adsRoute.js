import express from 'express'
import upload from '../middlewares/multer.js'
import adminAuth from '../middlewares/adminAuth.js'

const adsRouter = express.Router()
import {createAd,showAds,removeAd} from '../controllers/adsController.js'
adsRouter.post('/create',
    upload.fields([
        {name: "image1", maxCount: 1}
    ]),createAd)
adsRouter.get('/list',adminAuth,showAds);
adsRouter.post('/remove',adminAuth,removeAd);

export default adsRouter; 