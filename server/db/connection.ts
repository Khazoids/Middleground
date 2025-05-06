import mongoose from "mongoose";
import dotenv from "dotenv";
import { ConnectionOptions } from "tls";

dotenv.config({ path: "./config.env" });

const uri = process.env.ATLAS_URI || "";

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectionOptions);
        
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;