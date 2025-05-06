import User from "../models/User";

export const loginUser = async ( req : any, res : any) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).send("Email is required.");
        }

        const user = await User.findOne({ username: email }); // Or `email` depending on your schema.
        if (!user) {
            return res.status(404).send("User not found.");
        }

        res.status(200).json({
            email: user.username,
            password: "*********",
            zipCode: user.zipCode,
            vendor: user.vendor,
            cardInfo: user.cardInfo,
            billingAddress: user.billingAddress,
            notificationPrice: user.notificationPrice,
            notificationPriceBool: user.notificationPriceBool,
            notificationItemRemoved: user.notificationItemRemoved,
            priceChangePeriod: user.priceChangePeriod,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).send("Error fetching user profile.");
    }
}

export const registerUser = async ( req: any, res : any ) => {
    try {
        const { username, zipCode, vendor, cardInfo,billingAddress} = req.body;

        if (!username) {
            return res.status(400).send("Email is required.");
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { zipCode, vendor, cardInfo, billingAddress}, // Update all fields
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User not found.");
        }

        res.status(200).send("Profile updated successfully.");
    } catch (error) {
        console.error("Error updating user profile:", error.message);
        res.status(500).send("Error updating user profile.");
    }
}