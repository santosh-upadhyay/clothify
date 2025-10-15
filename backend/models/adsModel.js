import mongoose from "mongoose";    

const adsSchema =  new mongoose.Schema({
    title:{type:String,required:true},
    adslocation:{type:String,required:true},
    isActive:{type:Boolean,default:true},
    imageUrl: {type:String},
    link:{type:String,required:true},
    description:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
})
const adsModel = mongoose.model('ads',adsSchema);
export default adsModel;