import cron from 'node-cron';
import Watchlist from '../models/Watchlist'; // Update with the correct path
import nodemailer from 'nodemailer';
import Users from "../models/User";
import { amazonSearchById } from '../controllers/amazonController';
import { eBaySearchById } from '../controllers/ebayController'; // Import the Keepa API function

// Create an email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send price change notification
const sendPriceChangeNotification = async (email: string, item: any, priceChange: number) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Price Change Alert for ${item.name}`,
    text: `The price of ${item.name} has ${priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(
      priceChange
    ).toFixed(2)}%. Current price: $${item.priceHistory[item.priceHistory.length - 1].price}`,
  };

  await transporter.sendMail(mailOptions);
};

const sendItemRemovedNotification = async (email: string, item: any) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${item.name} was removed from ${item.vendor}`,
      text: `${item.name} has been removed from ${item.vendor} and is no longer for sale and is no longer in your watchlist`,
    };
  
    await transporter.sendMail(mailOptions);
  };

// Update prices and notify users
const updatePrices = async () => {
  const users = await Watchlist.find({}); // Get all users with watchlists
  
  for (const user of users) {
    const userSettings = await Users.find({ username: user.email });
    if(userSettings[0].notificationItemRemoved || userSettings[0].notificationPriceBool){
    for (const item of user.watchlist) {
      if(item.isNotified){
        try {
            

            let productData = await amazonSearchById(item.id);
            if (!productData) {
                console.error(`Ebay: ${item.id} ${item.vendor}`)
                productData = await eBaySearchById(item.id);
            }

            if (!productData || !productData.price) {
              if(userSettings[0].notificationItemRemoved){
                await sendItemRemovedNotification(user.email, item);
                console.error(`Failed to fetch price for ASIN: ${item._id}`);
                continue;
              }
            }


            const currentPrice = productData.price;

            if (item.priceHistory.length > 0) {
              const lastPrice = item.priceHistory[item.priceHistory.length - 1].price;
              if(item.priceHistory.length>userSettings[0].priceChangePeriod+1){
                const lastPrice = item.priceHistory[item.priceHistory.length - userSettings[0].priceChangePeriod].price;
              }
              else{
                const lastPrice = item.priceHistory[0].price;
              }
            
            // Calculate percentage change
            const priceChange = ((currentPrice - lastPrice) / lastPrice) * 100;

            // Notify user if price changed by more than 15%
            //Math.abs(priceChange) >= 15
            if(item.isNotified){
              if(item.usePriceLimit){
                if(currentPrice>lastPrice){
                  await sendPriceChangeNotification(user.email, item, currentPrice);
                }
              }
              if (Math.abs(priceChange) >= item.priceChange) {
                  await sendPriceChangeNotification(user.email, item, priceChange);
              }
            }
          }

            // Update price history
            item.priceHistory.push({ price: currentPrice });
            await user.save();
        } catch (error) {
            console.error(`Error updating price for item ${item._id}:`, error);
        }
     }
    }   
  }
  }
};

// Schedule cron job to run every day at midnight
const startPriceUpdaterCron = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily price update task...');
    await updatePrices();
    console.log('Price updates completed.');
  });
};

export { startPriceUpdaterCron };
