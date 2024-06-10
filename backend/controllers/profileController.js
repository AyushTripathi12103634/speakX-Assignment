import multer from "multer";
import usermodel from "../models/usermodel.js";
import { checkPassword, hashPassword } from "../helpers/bcyrptmain.js";

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/profiles/"); // Store uploaded files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.id}.jpg`); // Use the original file name
    },
});

export const imageuploadcontroller = async (req, res) => {
    try {
        const profile = req.file;
        if (!profile || profile.length === 0) {
            return res.status(400).send({
                success: false, 
                message: "No file uploaded",
            })
        }
        const id = req.user.id;
        const user = await usermodel.findOne({ _id: id });
        user.profile = profile.path;
        await user.save();
        res.status(200).json({
            success:true, 
            message:"Profile uploaded successfully",
            user:user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Fail to update profile",
            error: error.message
        })
    }
}

export const updateprofilecontroller = async (req, res) => {
    try {
        const { username, name } = req.body;
        console.log(username,name);
        const id = req.user.id;
        const user = await usermodel.findOne({ _id: id });
        if (username && username !== user.username) {
            const existingUser = await usermodel.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            user.username = username;
        }
        if (name) {
            user.name = name;
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Fail to update profile",
            error: error
        })
    }
}

export const updatepasswordcontroller = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const id = req.user.id;
        const user = await usermodel.findOne({ _id: id });
        const isValidPassword = await checkPassword(oldPassword, user.password);
        if(!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Wrong password' 
            });
        }
        const hashpassword = await hashPassword(newPassword);
        user.password = hashpassword;
        await user.save();
        return res.status(200).json({ 
            success: true, 
            message: 'Password updated successfully', 
            user: user 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Fail to update password', 
            error: error 
        });
    }
}
