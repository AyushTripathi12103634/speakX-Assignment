import mongoose from "mongoose";

const commentmodel = mongoose.Schema({
    comment_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
},
{
    timestamps: true
})

export default mongoose.model('Comments',commentmodel);
