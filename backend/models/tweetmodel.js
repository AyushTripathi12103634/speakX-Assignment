import mongoose from "mongoose";

const tweetmodel = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    file: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    liked_by: {
        type:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    comments: {
        type:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model('Tweets',tweetmodel);