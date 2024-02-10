import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { userSchemaSignUp,userSchemaLogin,transactionsSchema,giveMoneySchema } from './types/types.js';
import { Transactions, User } from './db/index.js';

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

app.get("/users",authenticateJwt,async(req,res)=>{
    const users = await User.find({})

    if(users)
    {
        res.status(200).json(users);
    }
    else{
        res.status(404).json({message : "User not found"})
    }
})

app.get("/transactions",authenticateJwt,async(req,res)=>{
    const transactions=await Transactions.find({})

    if(transactions)
    {
        res.status(200).json(transactions);
    }
    else{
        res.status(404).json({message : "User not found"})
    }

})

app.get("/balance", authenticateJwt, async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    try {
        const foundUser = await User.findOne({ email: user.email });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ balance: foundUser.balance });
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: "Error finding user" });
    }
});
app.post("/givemoney", authenticateJwt, async (req, res) => {
    const user = req.user;
    const payload = req.body;

    payload.amount = parseInt(payload.amount);

    const parsedData1 = giveMoneySchema.safeParse(payload);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!parsedData1.success) {
        return res.status(400).json({ message: "Invalid input from user"});
    }

    try {
        const parsedData = parsedData1.data
        const sender = await User.findOne({ email: user.email });
        const receiver = await User.findOne({ email: parsedData.email });

        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        if (sender.balance < parsedData.amount) {
            return res.status(400).json({ message: "Insufficient funds in sender's account" });
        }
        if(sender.email===receiver.email && sender.password === receiver.password)
        {
            return res.status(400).json({message:"Cant send to same user"})
        }

        sender.balance -= parsedData.amount;
        receiver.balance += parsedData.amount;

        const obj = {
            from: sender._id,
            to: receiver._id,
            received: parsedData.amount 
        };

        const transaction = await Transactions.create(obj);
        sender.transactions.push(transaction);
        receiver.transactions.push(transaction);

        await sender.save();
        await receiver.save();

        return res.status(200).json({ message: "Amount transferred successfully" });
    } catch (error) {
        console.error("Error transferring amount:", error);
        return res.status(500).json({ message: "Error transferring amount" });
    }
});








// /request =>get all req and when u pay then /givemoney should work

// /givemoney




app.listen(3000, () => {
    console.log("app started on port : 3000");
});
