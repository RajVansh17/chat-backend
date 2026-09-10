import { createConversation, getUserConversations } from "../services/conversationService.js"
import Conversation from "../model/Conversation.js";

export const createConversationController = async (req, res) => {
    try {
        const currentuserId = req.user.id;
        const { userId } = req.body;

        if (!currentuserId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            })
        }
        const conversation = await createConversation(currentuserId, userId);

        if(conversation === 1){
            return res.status(404).json({
                success: false,
                message: "user not found",
                conversation
            })
            
        }
        else if(conversation === 2){
            return res.status(400).json({
                success: false,
                message: "you can not create a convo with yourself",
                conversation
            })
            
        }
        return res.status(201).json({
            success: true,
            message: "convo created",
            conversation
        })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "inernal server error"
        }
        )
    }
}

export const getConversationController = async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await getUserConversations(userId);

        return res.status(200).json({
            success:true,
            conversations
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }

}