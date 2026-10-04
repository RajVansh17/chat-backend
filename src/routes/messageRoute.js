import express from 'express';
import { createMessageController, getConversationMessagesController } from '../controllers/messageController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { requireConversationMember } from '../middleware/conversationMiddleware.js';


const router = express.Router();

router.post(
    "/:conversationId/messages",
    authenticateToken,
    requireConversationMember,
    createMessageController
);
router.get(
    "/:conversationId/messages",
    authenticateToken,
    requireConversationMember,
    getConversationMessagesController
);

export default router;

