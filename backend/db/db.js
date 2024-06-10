import mongoose from "mongoose";

function connect() {
    try {
        mongoose.connect(process.env.MongoURI);
        console.log("Connection to database Established.")
    } catch (error) {
        console.log("Error connecting to database: ", error)
    }
}

export default connect;
