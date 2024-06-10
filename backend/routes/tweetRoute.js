import {Router} from "express";
import multer from "multer";
import { requireSignIn } from "../middleware/authmiddleware.js";
import { commentTweetController, createTweetController, deleteTweetController, followUserController, getAllTweetsController, getTweetByIdController, getTweetsByFollowingController, getTweetsByUserController, getUsercontroller, likeTweetController, storage, unfollowUserController, updateTweetController } from "../controllers/tweetController.js";
const upload = multer({ storage: storage });
const router = Router();
router.post("/create-tweet",requireSignIn,upload.array("file"),createTweetController)
router.post("/update-tweet/:id",requireSignIn,upload.array("file"),updateTweetController)
router.delete("/delete-tweet/:id",requireSignIn,deleteTweetController)
router.patch("/like-tweet/:id",requireSignIn,likeTweetController)
router.post("/comment-tweet/:id",requireSignIn,commentTweetController)
router.patch("/follow-user/:userId",requireSignIn,followUserController)
router.patch("/unfollow-user/:userId",requireSignIn,unfollowUserController)
router.get("/tweet/:id",requireSignIn,getTweetByIdController)
router.get("/user-tweet/:userId",requireSignIn,getTweetsByUserController)
router.get("/tweets",requireSignIn,getAllTweetsController)
router.get("/following-tweet",requireSignIn,getTweetsByFollowingController)
router.get("/get-user/:username",requireSignIn,getUsercontroller)

export default router;