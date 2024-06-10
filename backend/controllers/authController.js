import usermodel from "../models/usermodel.js";
import {hashPassword, checkPassword} from "../helpers/bcyrptmain.js";
import JWT from "jsonwebtoken";
export const registercontroller = async (req, res) => {
    try {
        const { username, name, password } = req.body;
        if(!username) {
            return res.status(400).json({ 
                success: false,
                message: 'Please enter username' 
            });
        }
        if(!name) {
            return res.status(400).json({ 
                success: false,
                message: 'Please enter name' 
            });
        }
        if(!password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please enter password' 
            });
        }
        const existingUser = await usermodel.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashpassword = await hashPassword(password);
        const user = new usermodel({ username:username.toLowerCase(), name, password: hashpassword });
        await user.save();
        return res.status(201).json({ 
            success:true, 
            message: 'User created successfully', 
            user 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Error in register api',
            error: error 
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter username' 
            });
        }
        if(!password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter password' 
            });
        }
        const user = await usermodel.findOne({ username:username.toLowerCase() });
        if(!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User does not exist'
            });
        }
        const isValidPassword = await checkPassword(password, user.password);
        if(!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid password' 
            });
        }
        const token = JWT.sign({ 
            id: user._id, 
            username: user.username.toLowerCase() 
            }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: '7d' 
        });
        return res.status(200).json({ 
            success: true, 
            message: 'User logged in successfully', 
            token: token,
            username: user.username.toLowerCase(),
            id: user._id
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Error in login api', 
            error: error 
        });
    }
};

export const checklogincontroller = async(req,res) => {
    try {
        const check = JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        if (check) {
            return res.status(200).send({
                success: true,
                message: "Verification successfuly",
            })
        }
        else{
            return res.status(400).send({
                success: false,
                message: "Verification failed",
            })
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in check login api",
            error: error
        })   
    }
}