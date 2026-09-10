import express from "express";
import { searchUsers } from "../controllers/userController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();


router.get('/', authenticateToken, searchUsers);


export default router;