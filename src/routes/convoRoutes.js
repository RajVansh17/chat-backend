import express from "express"
import { createConversationController, getConversationController } from "../controllers/conversationController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();


router.post('/' ,authenticateToken, createConversationController);
router.get('/' ,authenticateToken, getConversationController);

export default router;