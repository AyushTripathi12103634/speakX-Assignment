import {Router} from "express";
import multer from "multer";
import { requireSignIn } from "../middleware/authmiddleware.js";
import { storage, imageuploadcontroller, updateprofilecontroller, updatepasswordcontroller } from "../controllers/profileController.js";


const upload = multer({ storage: storage });

const router = Router();
router.post("/upload",requireSignIn,upload.single("file"),imageuploadcontroller);
router.post("/update-profile",requireSignIn,updateprofilecontroller);
router.post("/update-password",requireSignIn,updatepasswordcontroller);

export default router;