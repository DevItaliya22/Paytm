import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
    userSchemaLogin,
    transactionsSchema,
    userSchemaSignUp,
    giveMoneySchema,
    creditDebitSchema,
    updatePassword,
    friendsSchema,
    reqMoneySchema
} from './types/types.js';
import { Transactions, User,Request } from './db/index.js';


const app = express();

app.use(express.json());
app.use(cors());

const numericRegex = /^[0-9]+$/;
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
 
    if(numericRegex.test(payload.number))
    {
        payload.number=parseInt(payload.number)
    }
    else{
        return res.status(200).json({message: "Invalid input from user"})
    }
    const parsedData = userSchemaSignUp.safeParse(payload);

    if (parsedData.success) {
        const { email, password, number,username } = parsedData.data;
        console.log(parsedData);

        try {
            const alreadyExist = await User.findOne({ email });
            
            if (alreadyExist) {
                return res.status(200).json({ message: "User already exists" });
            }

            const user = new User({
                email: email,
                password: password,
                number: number,
                balance: 10000,
                username:username
            });

            await user.save();
            const token = jwt.sign({ email }, secret, { expiresIn: '1000h' });
            console.log("User created from signup");
            return res.status(200).json({ message: "User created", token: token }); 
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(200).json({ message: "Error creating user" });
        }
    } else {
        console.log("Invalid input from user");
        return res.status(200).json({ message: "Invalid input from user", errors: parsedData.error });
    }
});

app.post("/login", async (req, res) => {
    const payload = req.body;
    const parsedData = userSchemaLogin.safeParse(payload);

    if (parsedData.success) {
        const { email, password } = parsedData.data;

        try {
            const user = await User.findOne({ email:email,password: password });

            if (user) {
                const token = jwt.sign({ email }, secret, { expiresIn: '1000h' });
                console.log("User logged in successfully");
                return res.status(200).json({ message: "User logged in", token: token });
            } else {
                console.log("Invalid email or password in login");
                return res.status(200).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            console.error("Error logging in:", error);
            return res.status(200).json({ message: "Error logging in" });
        }
    } else {
        console.log("Invalid input from user");
        return res.status(200).json({ message: "Invalid input from user", errors: parsedData.error });
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

app.get("/mytransactions",authenticateJwt,async(req,res)=>{
    const transactions=await Transactions.find({})

    if(transactions)
    {
        const user =await User.findOne({email:req.user.email})

        const arr=[]

        for(let i=0;i<user.transactions.length;i++)
        {
            const x=user.transactions[i];
            const y=await Transactions.findOne({_id : x})
            arr.push(y)
        }

        res.status(200).json(arr);
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
            received: parsedData.amount ,
            from_name : sender.username,
            to_name : receiver.username
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

app.post("/creditmoney",authenticateJwt, async (req, res) => {
    const user = req.user;
    const payload = req.body;
    payload.amount = parseInt(payload.amount);
    const parsedData = creditDebitSchema.safeParse(payload);

    if (!parsedData.success) {
        return res.status(400).json({ message: "Wrong format for input" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const foundUser = await User.findOne({ email: user.email });

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        foundUser.balance += parsedData.data.amount;

        const obj={
            from:foundUser._id,
            to:foundUser._id,
            received:parsedData.data.amount,
            from_name:foundUser.username,
            to_name:foundUser.username
        }
        const transaction=await Transactions.create(obj)
        foundUser.transactions.push(transaction)
        await foundUser.save();

        return res.status(200).json({ message: "Amount credited successfully" });
    } catch (error) {
        console.error("Error crediting amount:", error);
        return res.status(500).json({ message: "Error crediting amount" });
    }
});

app.post("/debitmoney",authenticateJwt, async (req, res) => {
    const user = req.user;
    const payload = req.body;
    payload.amount = parseInt(payload.amount);
    const parsedData = creditDebitSchema.safeParse(payload);

    if (!parsedData.success) {
        return res.status(400).json({ message: "Wrong format for input" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const foundUser = await User.findOne({ email: user.email });

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if(foundUser.balance<parsedData.data.amount)
        {
            return res.status(404).json({message:"Not sufficient money"})
        }
        foundUser.balance -= parsedData.data.amount;
       

        const obj={
            from:foundUser._id,
            to:foundUser._id,
            received:parsedData.data.amount,
            from_name:foundUser.username,
            to_name:foundUser.username
        }
        const transaction=await Transactions.create(obj)
        foundUser.transactions.push(transaction)
        await foundUser.save();
        

        return res.status(200).json({ message: "Amount debited successfully" });
    } catch (error) {
        console.error("Error crediting amount:", error);
        return res.status(500).json({ message: "Error debiting amount" });
    }
});

app.post("/updatePassword", authenticateJwt, async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const parsedData = updatePassword.safeParse(payload);

    try {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!parsedData.success) {
            return res.status(400).json({ message: "Invalid input", errors: parsedData.error });
        }

        const foundUser = await User.findOne({ email: user.email });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const { old_password, new_password1, new_password2 } = parsedData.data;

        if (old_password !== foundUser.password) {
            return res.status(200).json({ message: "Incorrect old password" });
        }

        if (new_password1 !== new_password2) {
            return res.status(200).json({ message: "New passwords do not match" });
        }

        foundUser.password = new_password1;
        await foundUser.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(200).json({ message: "Error updating password" });
    }
});

app.get("/showpassword", authenticateJwt, async (req, res) => {
    const user = req.user;

    try {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const foundUser = await User.findOne({ email: user.email });

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ password:foundUser.password });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: "Error fetching user details" });
    }
});

app.get("/friends",authenticateJwt,async(req,res)=>{
    const user=req.user;
    try {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const foundUser = await User.findOne({ email: user.email });

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const arr=[]
        for(let i=0;i<foundUser.friends.length;i++)
        {
            const x=foundUser.friends[i]
            const y=await User.findById(x._id)
            const obj={
                username : y.username,
                number :y.number
            }
            arr.push(obj)
        }

        return res.status(200).json({ friends:arr});
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: "Error fetching user details" });
    }
})

app.post("/addfriends", authenticateJwt, async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const { data, success } = friendsSchema.safeParse(payload);

    if (!success) {
        return res.status(400).json({ message: "Invalid input", errors: friendsSchema.error });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const foundUser = await User.findOne({ email: user.email });
        const friend = await User.findOne({ email: data.email });

        if (!friend) {
            return res.status(404).json({ message: "Friend not found" });
        }

        if (foundUser.friends.includes(friend._id)) {
            return res.status(400).json({ message: "Friend already added" });
        }
        
        if (user.email === friend.email) {
            return res.status(400).json({ message: "Cannot add self as friend" });
        }

        foundUser.friends.push(friend._id);
        await foundUser.save();

        return res.status(200).json({ message: "Friend added successfully" });
    } catch (error) {
        console.error("Error adding friend:", error);
        return res.status(500).json({ message: "Error adding friend" });
    }
});

app.get("/sentRequests", authenticateJwt, async (req, res) => {
    const user = req.user;

    try {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const foundUser = await User.findOne({ email: user.email });

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (foundUser.requestSent.length > 0) {
            const arr=[]
            for(let i=0;i<foundUser.requestSent.length;i++)
            {
                const x=foundUser.requestSent[i]
                const y=await Request.findById(x._id)
                const obj={
                    from_name:y.from_name,
                    to_name:y.to_name,
                    amount:y.amount
                }
                arr.push(obj)
            }
            return res.status(200).json({ requestSent: arr });
        } else {
            return res.status(401).json({ message: "No request sent" });
        }
    } catch (error) {
        console.error("Error fetching sent requests:", error);
        return res.status(500).json({ message: "Error fetching sent requests" });
    }
});

app.get("/requestReceived", authenticateJwt, async (req, res) => {
    const user = req.user;

    try {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const foundUser = await User.findOne({ email: user.email });

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (foundUser.requestReceived.length > 0) {

            const arr=[]
            for(let i=0;i<foundUser.requestReceived.length;i++)
            {
                const x=foundUser.requestReceived[i]
                const y=await Request.findById(x._id)
                const obj={
                    from_name:y.from_name,
                    to_name:y.to_name,
                    amount:y.amount
                }
                arr.push(obj)
            }
            return res.status(200).json({ requestReceived: arr });
        } else {
            return res.status(401).json({ message: "No requests received" });
        }
    } catch (error) {
        console.error("Error fetching received requests:", error);
        return res.status(500).json({ message: "Error fetching received requests" });
    }
});

app.post("/sendRequest", authenticateJwt, async (req, res) => {
    const user = req.user;
    const payload = req.body;
    payload.amount=parseInt(payload.amount)
    const { success, data } = giveMoneySchema.safeParse(payload);

    if (!success) {
        return res.status(400).json({ message: "Invalid input from user", errors: giveMoneySchema.error });
        
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const reqSender = await User.findOne({ email: user.email }); 
        const reqReceiver = await User.findOne({ email: data.email }); 

        if (!reqReceiver) {
            return res.status(404).json({ message: "Receiver does not exist" });
        }
        if(reqSender.email===reqReceiver.email)
        {
            return res.status(200).json({message:"Cannot send request to same user"})
        }
        const obj = {
            from: reqSender._id,
            to: reqReceiver._id,
            active: true,
            from_name:reqSender.username,
            to_name:reqReceiver.username,
            amount: data.amount
        };

        const request = await Request.create(obj);
        const id = request._id;

        reqSender.requestSent.push(id);
        reqReceiver.requestReceived.push(id);

        await reqSender.save();
        await reqReceiver.save();
        await request.save();
    
        return res.status(200).json({ message: "Request sent successfully" });
    } catch (error) {
        console.error("Error sending request:", error);
        return res.status(500).json({ message: "Error sending request" });
    }
});

app.post("/fulfillRequest", authenticateJwt, async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const { success, data } = reqMoneySchema.safeParse(payload);

    if (!success) {
        return res.status(400).json({ message: "Invalid input from user" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const request = await Request.findById(data.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const from = await User.findById(request.from);
        const to = await User.findById(request.to);
        const amount = request.amount;

        if (!from || !to) {
            return res.status(404).json({ message: "Sender or receiver not found" });
        }


        if (to.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        if(request.active===false)
        {
            return res.status(200).json({message:"Alrady full filled"});
        }

        const transaction = new Transactions({
            from: from._id,
            to: to._id,
            received: amount,
            amount: amount,
            from_name:from.username,
            to_name:to.username
        });

        await transaction.save();

        from.balance -= amount;
        to.balance += amount;

        await from.save();
        await to.save();

        request.active = false;
        await request.save();

        return res.status(200).json({ message: "Request fulfilled successfully" });
    } catch (error) {
        console.error("Error fulfilling request:", error);
        return res.status(500).json({ message: "Error fulfilling request" });
    }
});


app.listen(3000, () => {
    console.log("app started on port : 3000");
});
