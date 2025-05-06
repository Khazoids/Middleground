import express from "express";
import cors from "cors";
import auth from "./routes/auth";
import profile from "./routes/profile";
import settings from "./routes/settings";
import connectDB from "./db/connection";
import search from "./routes/search";
import watchlist from "./routes/watchlist";
import { startPriceUpdaterCron } from './cron/priceUpdater';

const PORT = process.env.PORT || 5050;
const app = express();
//import cors from "cors";

startPriceUpdaterCron();

// Allow requests from localhost:5173
app.use(cors({
  origin: [
    'http://3.135.183.236',
    'http://3.145.60.60:5050/',
    'http://middleground.college', 
    'http://www.middleground.college',
    // Include localhost for development
    'http://localhost:5173'
  ],
  credentials: true
}));

connectDB();

app.use(express.json());

// Add 'authenticate' for routes that need user log in
// Add 'authorizeRole(["admin"])' : swapping admin, user, seller, or buyer for routes that need more specific permissions

app.use("/auth", auth);
app.use("/search", search);
app.use("/dashboard", profile);
app.use("/dashboard", settings);
app.use("/watchlist", watchlist);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});