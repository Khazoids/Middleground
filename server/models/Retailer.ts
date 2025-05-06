import mongoose from "mongoose";

const retailerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        website: {
            type: String,
            required: true,
            unique: true,
        },
        flatRateShipping: {
            type: Number,
            default: null,
        },
        freeShippingThreshold: {
            type: Number,
            default: null,
        },
        shippingDetails: {
            type: String,
            default: "",
        },
        logo: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Retailer = mongoose.model("Retailer", retailerSchema);

export default Retailer;
