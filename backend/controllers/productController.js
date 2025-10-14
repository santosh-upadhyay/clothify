import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
// import CLOUDINARY_API_KEY from "..\.env"
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // uploading images to cloudinary
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

// console.log(images)
// console.log(name, description, price, category, subCategory, sizes, bestseller);

let imagesUrl = await Promise.all(
  images.map(async (item) => {
    // console.log(images)
      const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
      // console.log(images)
      return result.secure_url
  })
)

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };

    // console.log(productData);

    const newProduct = new productModel(productData);
    await newProduct.save();

    res.json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message,error });
  }
};
// function for list product 
const listProducts = async (req, res) => {
    try {

        const products = await productModel.find({})
        // console.log(products)
        res.json({success: true, products})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}
// function for remove product 
const removeProduct = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product Removed"})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}
// function for singl product Info
const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}
export { addProduct, listProducts, removeProduct, singleProduct }
