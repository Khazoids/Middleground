import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT

// Connects to our email to send out a recovery password reset link
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// User registration route
router.post("/register", async (req : any, res : any) => {
    try {
        const { username, password,zipCode, lastName, firstName, role = "user" } = req.body;
    
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    
        const verificationToken = crypto.randomBytes(32).toString("hex"); // Generate a verification token
    
        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            zipCode,
            lastName,
            firstName,
            role,
            verificationToken,
        });
        await newUser.save();
    
        // Send verification email
        // const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        // const mailOptions = {
        //     from: process.env.EMAIL_USER,
        //     to: username,
        //     subject: "Verify Your Email",
        //     text: `Welcome to Middleground! Please verify your email by clicking the link below:\n\n${verificationLink}\n\n`,
        // };
        const verificationLink = `${process.env.CLIENT_URL}/auth/verify-email/${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: username, // assuming this is the email
            subject: "Verify Your Email",
            text: `Welcome to Middleground! Please verify your email by clicking the link below:\n\n${verificationLink}`,
            };

        await transporter.sendMail(mailOptions);

    
        // await transporter.sendMail(mailOptions);
    
        res.status(201).json({
            message: "Registration successful! Please check your email to verify your account.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to register user." });
    }
});

// User registration verification route
router.get("/verify-email/:token", async (req : any, res : any) => {
    const { token } = req.params;
  
    try {
        // Find the user with the matching verification token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }
    
        // Mark the user as verified and remove the token
        user.isVerified = true;
        user.verificationToken = null;
        const firstName = user.firstName;
        const lastName = user.lastName;
        await user.save();
        return res.status(200).json({  message: "Email verified successfully! You can now log in.", email: user.username, firstName: firstName, lastName: lastName});

        //res.status(200).json({ message: "Email verified successfully! You can now log in." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to verify email." });
    }
});

router.post("/forgot-password", async (req : any, res : any) => {
    const { email } = req.body;
  
    try {
        // Find the user by email
        const user = await User.findOne({ username: email });
        if (!user) {
            return res.status(404).json({ error: "User not found" + email});
        }
    
        // Generate a reset token and expiry
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000 as any; // Token valid for 1 hour
        await user.save();
    
        // Send email with the reset link
        const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\n`,
        };
  
        
        //const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // Use 465 for SSL
            secure: false, // false for TLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        
        await transporter.sendMail(mailOptions);
    
        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process password reset request" });
    }
});

router.post("/reset-password/:token", async (req : any, res : any) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
        // Find user by reset token and check expiry
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
        });
    
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
    
        // Update user password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
    
        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to reset password" });
    }
});

export default router;

// // User registration route

router.post("/login", async (req : any, res : any) => {
    
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).send("Username and password are required.");
      }
  
      // Find the user in the database
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).send("User not found.");
      }
      if (!user.isVerified) {
        return res.status(403).json({ error: "Email not verified" });
      }
      

        // if (!user.isVerified) {
        //     return res.status(403).json({ error: "Email not verified" });
        // }
  
      // Compare passwords

      const firstName = user.firstName;
      const lastName = user.lastName;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send("Invalid password.");
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "12h" } // Token expires in 12 hours
      );
  
      res.status(200).send({ message: "Login successful!", token , firstName: firstName, lastName: lastName});
    } catch (error) {
      console.error(error);
      res.status(500).send("Error logging in.");
    }
  });

