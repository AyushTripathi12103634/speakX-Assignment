import tweetmodel from "../models/tweetmodel.js";
import usermodel from "../models/usermodel.js";
import commentmodel from "../models/commentmodel.js";
import multer from "multer";
import fs from "fs";

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/tweets/");
    },
    filename: function (req, file, cb) {
        const tempFileName = Date.now(); // Use current timestamp as temporary file name
        if (file.mimetype.startsWith('image/')) cb(null, `${tempFileName}.jpg`);
        else if (file.mimetype.startsWith('video/')) cb(null, `${tempFileName}.mp4`);
    },
});

export const createTweetController = async (req, res) => {
    try {
        const author = req.user.id;
        const { content } = req.body;
        const file = req.files[0].path;
        const tweet = new tweetmodel({author, content});
        await tweet.save();
        if(file) {
            const newFileName = `/tweets/${tweet._id}` + (req.files[0].mimetype.startsWith("image") ? ".jpg" : ".mp4");
            tweet.file = newFileName;
            fs.rename(file,`public${newFileName}`,function(err){
                if(err) console.log(err);
            });
        }
        await tweet.save();
        const user = await usermodel.findOne({_id:id});
        user.tweet.push(tweet._id);
        return res.status(201).json({
            success: true,
            message: 'Tweet created successfully',
            tweet: tweet
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in creating tweet',
            error: error
        });
    }
};

export const updateTweetController = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const image = req.files[0];
        if (image) {
            const updatedTweet = await tweetmodel.findByIdAndUpdate(id, { content, image: image.path },{ new: true });
            return res.status(200).json({
                success: true,
                message: 'Tweet updated successfully',
                tweet: updatedTweet
            });
        }
        else{
            const updatedTweet = await tweetmodel.findByIdAndUpdate(id, { content },{ new: true });
            return res.status(200).json({
                success: true,
                message: 'Tweet updated successfully',
                tweet: updatedTweet
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in updating tweet',
            error: error
        });
    }
};

export const deleteTweetController = async (req, res) => {
    try {
        const { id } = req.params;
        await tweetmodel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Tweet deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in deleting tweet',
            error: error
        });
    }
};

export const likeTweetController = async (req, res) => {
    try {
        const { id } = req.params;
        const tweet = await tweetmodel.findById(id);
        const userId = String(req.user.id);
        if (tweet.liked_by.includes(userId)) {
            tweet.liked_by = tweet.liked_by.filter(likedById => String(likedById) !== userId);
            tweet.likes--;
            await tweet.save();
            res.status(200).json({
                success: true,
                message: 'Tweet unliked successfully',
                tweet: tweet
            });
        } else {
            tweet.liked_by.push(userId);
            tweet.likes++;
            await tweet.save();
            res.status(200).json({
                success: true,
                message: 'Tweet liked successfully',
                tweet: tweet
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in liking tweet',
            error: error
        });
    }
}


export const commentTweetController = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const tweet = await tweetmodel.findById(id);
        const userId = req.user.id;
        const newComment = new commentmodel({ comment_by: userId, comment });
        await newComment.save();
        tweet.comments.push(newComment._id);
        await tweet.save();
        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comment: newComment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in commenting tweet',
            error: error
        });
    }
};

export const followUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await usermodel.findOne({_id: req.user.id});
        user.following.push(userId);
        const following_user = await usermodel.findOne({_id: userId});
        following_user.followers.push(user._id);
        user.following_count++;
        following_user.followers_count++;
        await user.save();
        await following_user.save();
        return res.status(200).json({
            success: true,
            message: 'User followed successfully',
            user: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in following user',
            error: error
        });
    }
};

export const unfollowUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await usermodel.findOne({_id: req.user.id});
        user.following = user.following.filter(followingId => String(followingId) !== String(userId));
        const following_user = await usermodel.findOne({_id: userId});
        following_user.followers = following_user.followers.filter(followersId => String(followersId) !== String(user._id));
        user.following_count--;
        following_user.followers_count--;
        await user.save();
        await following_user.save();
        return res.status(200).json({
            success: true,
            message: 'User unfollowed successfully',
            user: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in unfollowing user',
            error: error
        });
    }
};

export const getTweetByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const tweet = await tweetmodel.findById(id);
        tweet.author = await usermodel.findOne({_id: tweet.author});

        const main_tweet = tweet.toObject();

        for(let i = 0; i < main_tweet.comments.length; i++) {
            let comment = await commentmodel.findById(main_tweet.comments[i]);
            comment.comment_by = await usermodel.findOne({_id: comment.comment_by});
            main_tweet.comments[i] = comment;
        }

        return res.status(200).json({
            success: true,
            message: 'Tweet fetched successfully',
            tweet: main_tweet
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in getting tweet',
            error: error
        });
    }
};


export const getTweetsByUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const tweets = await tweetmodel.find({ author: userId }).sort({createdAt: -1});
        await Promise.all(tweets.map(async (tweet) => {
            tweet.author = await usermodel.findOne({_id: tweet.author});
        }));
        return res.status(200).json({
            success: true,
            message: 'Tweets fetched successfully',
            tweets: tweets
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in getting tweets',
            error: error
        });
    }
};

export const getAllTweetsController = async (req, res) => {
    try {
        const tweets = await tweetmodel.find().sort({createdAt: -1});
        await Promise.all(tweets.map(async (tweet) => {
            tweet.author = await usermodel.findOne({_id: tweet.author});
        }));
        return res.status(200).json({
            success: true,
            message: 'Tweets fetched successfully',
            tweets: tweets,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in getting tweets',
            error: error
        });
    }
};


export const getTweetsByFollowingController = async(req,res) => {
    try {
        const {id} = req.user;
        const user = await usermodel.findById(id).populate('following');
        let tweets = [];
        for(let i=0; i<user.following.length; i++){
            let userTweets = await tweetmodel.find({author: user.following[i]._id}).populate('author');
            tweets = tweets.concat(userTweets);
        }
        tweets.sort((a, b) => b.createdAt - a.createdAt);
        
        const filteredTweets = tweets.filter(tweet => tweet.author._id.toString() != id.toString());

        return res.status(200).json({
            success: true,
            message: 'Tweets fetched successfully',
            tweets: filteredTweets
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Error in getting tweets',
            error: error
        })
    }
}


export const getUsercontroller = async(req,res) => {
    try {
        const {username} = req.params;
        const users = await usermodel.find({username: new RegExp(username, 'i')});
        let userlist = users.map((user) => {
            let userObject = user.toObject();
            if(userObject.followers.map(String).includes(String(req.user.id))){
                userObject.follow = true;
            }
            else{
                userObject.follow = false;
            }

            return userObject;
        })
        
        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            users: userlist
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Error in getting users',
            error: error
        })
    }
}
