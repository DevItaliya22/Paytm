import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { userSchemaSignUp,userSchemaLogin,transactionsSchema } from './types/types.js';
import { User } from './db/index.js';

const app = express();

app.use(express.json());
app.use(cors());

const secret = "Secret-Hai-Kyu-Batau"; 

mongoose.connect('mongodb://localhost:27017/paytm');

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, secret, (err, user) => {
            if (err) {
                console.log("Authentication failed in middleware");
                return res.sendStatus(403);
            } else {
                console.log("Authentication completed in middleware");
                req.user = user;
                next();
            }
        });
    } else {
        console.log("Token not found");
        res.status(401).json({ message: "Token not found" });
    }
};

app.post("/signup", async (req, res) => {
    const payload = req.body;
    payload.number= parseInt(payload.number)
    const parsedData = userSchemaSignUp.safeParse(payload);

    if (parsedData.success) {
        const { email, password, number } = parsedData.data;

        try {
            const alreadyExist = await User.findOne({ email });
            
            if (alreadyExist) {
                return res.status(409).json({ message: "User already exists" });
            }

            const user = new User({
                email: email,
                password: password,
                number: number,
                balance: 10000,
            });

            await user.save();
            const token = jwt.sign({ email }, secret, { expiresIn: '1000h' });
            console.log("User created from signup");
            return res.status(201).json({ message: "User created", token: token }); 
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Error creating user" });
        }
    } else {
        console.log("Invalid input from user");
        return res.status(400).json({ message: "Invalid input from user", errors: parsedData.error });
    }
});

app.post("/login", async (req, res) => {
    const payload = req.body;
    const parsedData = userSchemaLogin.safeParse(payload);

    if (parsedData.success) {
        const { email, password } = parsedData.data;

        try {
            const user = await User.findOne({ email, password });

            if (user) {
                const token = jwt.sign({ email }, secret, { expiresIn: '1000h' });
                console.log("User logged in successfully");
                return res.status(200).json({ message: "User logged in", token: token });
            } else {
                console.log("Invalid email or password in login");
                return res.status(404).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            console.error("Error logging in:", error);
            return res.status(500).json({ message: "Error logging in" });
        }
    } else {
        console.log("Invalid input from user");
        return res.status(400).json({ message: "Invalid input from user", errors: parsedData.error });
    }
});



app.listen(3000, () => {
    console.log("app started on port : 3000");
});
