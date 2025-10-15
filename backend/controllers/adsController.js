import adsModel from '../models/adsModel.js';
import { v2 as cloudinary } from "cloudinary";

const createAd = async (req, res) => {
    try {
        const { title, description, category, link } = req.body;

        // Validate required fields
        if (!title || !description || !category || !link) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const image = req.files && req.files.image1 && req.files.image1[0];
        if (!image) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        // Upload image to Cloudinary and get secure URL
        // multer stores the file on disk at image.path; ensure it exists before uploading
        if (!image.path) {
            console.error('createAd error: uploaded file missing path', image);
            return res.status(500).json({ success: false, message: 'Uploaded file missing on server' });
        }

        const uploadResult = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
        const imageUrl = uploadResult && uploadResult.secure_url ? uploadResult.secure_url : '';

        const newAd = {
            title,
            adslocation: category,
            imageUrl,
            link,
            description,
        };

        const ad = new adsModel(newAd);
        await ad.save();

        res.status(201).json({ success: true, message: "Ad created successfully", ad });
    } catch (error) {
        console.error('createAd error:', error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

const showAds = async (req, res) => {
    try {
        const ads = await adsModel.find();
        res.status(200).json({ success: true, ads });
    } catch (error) {
        console.error('showAds error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const removeAd = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Ad ID is required" });
        }
        const ad = await adsModel.findById(id);
        if (!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }
        await adsModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Ad removed successfully" });
    } catch (error) {
        console.error('removeAd error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { createAd, showAds, removeAd };
