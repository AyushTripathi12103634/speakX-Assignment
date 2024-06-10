import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./db/db.js";
import authRoute from "./routes/authRoute.js";
import profileRoute from "./routes/profileRoute.js";
import tweetRoute from "./routes/tweetRoute.js";

dotenv.config();

db();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/profiles', express.static('public/profiles'));
app.use('/tweets', express.static('public/tweets'));

app.use("/server/api/auth",authRoute);
app.use("/server/api/profile",profileRoute);
app.use("/server/api/tweet",tweetRoute);

app.listen(5000, () => {
    console.log("Server running on port 5000");
})