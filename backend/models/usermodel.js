import mongoose from "mongoose";

const userschema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: { 
        type: String 
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following_count: {
        type: Number,
        default: 0,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers_count: {
        type: Number,
        default: 0,
    },
    tweets: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweets' }],
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model('User',userschema);