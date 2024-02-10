import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        unique : true,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    number : {
        type : Number,
        required : true
    },
    balance :{
        type : Number 
    },
    transactions : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Transactions"
        }
    ],
    requests : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Transactions'
        }
    ]
})

const transactionsSchema= new mongoose.Schema({
    from :{
        type:mongoose.Schema.Types.ObjectId
    },
    to : {
        type:mongoose.Schema.Types.ObjectId
    },
    received :
    {
        type : Number,
        required : true
    }
})


const Transactions = mongoose.model('Transactions',transactionsSchema)
const User = mongoose.model('User',userSchema);

export {
    User,Transactions
}