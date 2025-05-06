import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    zipCode: { 
      type: String, 
      required: true 
    },
    vendor: { 
      type: String,
    },
    cardInfo: { 
      type: String, 
      default: "N/A",
    },
    billingAddress: { 
      type: String, 
      default: "none",
    },
    notificationItemRemoved: {
      type: Boolean,
      default: true,
    },
    notificationPriceBool: {
      type: Boolean,
      default: true,
    },
    priceChangePeriod: {
      type: Number,
      default: 1,
    },
    notificationPrice: {
      type: Number,
      default: 15,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller", "buyer"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    favoriteRetailers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Retailer",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
