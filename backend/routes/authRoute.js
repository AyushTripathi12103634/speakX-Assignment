import { Router } from "express";
import { loginController, registercontroller, checklogincontroller } from "../controllers/authController.js";

const router = Router();
router.post("/register",registercontroller);
router.post("/login",loginController);
router.get("/check-login",checklogincontroller);

export default router;