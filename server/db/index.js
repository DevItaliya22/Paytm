import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        unique : true,
        required : true
    },
    username:{
        type:String,
        required:true
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
    transactions : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Transactions"
        }],
    requestSent : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Requests'
        }],
    friends : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }],
    requestReceived : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Requests'
    }]
})

const requestSchema=new mongoose.Schema({
    active :{
        type:Boolean 
    },
    from :{
        type:mongoose.Schema.Types.ObjectId
    },
    to:{
        type:mongoose.Schema.Types.ObjectId
    },
    from_name:{
        type:String
    },
    to_name:{
        type:String
    },
    amount : {
        type : Number,
        required : true
    }

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
    },
    from_name:{
        type:String
    },
    to_name:{
        type:String
    }
})


const Transactions = mongoose.model('Transactions',transactionsSchema)
const User = mongoose.model('User',userSchema);
const Request = mongoose.model('Request',requestSchema)

export {
    User,Transactions,Request
}