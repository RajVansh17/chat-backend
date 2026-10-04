import mongoose from "mongoose";
import { createMessage, getConversationMessages } from "../services/messageService.js";

export const createMessageController = async (req,res,next) => {
    try {
        const {conversationId} = req.params;
        const {content} = req.body;

        if(!mongoose.Types.ObjectId.isValid(conversationId)){
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        const trimmedContent = content.trim();

        if(!trimmedContent || trimmedContent.length === 0) {
            return res.status(400).json({
                success:false,
                message:"Message content is required",
            })
        }

        const message = await createMessage(
            conversationId,
            req.user.id,
            trimmedContent
        );

        return res.status(201).json({
            success:true,
            message:"Message sent successfully",
        });

    }
    catch(err){
         console.log(err);
         return res.status(500).json({
            success: false,
            message: err.message
        });
    }

}

export const getConversationMessagesController = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // 1. Validate conversation ID
        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        // 2. Get pagination values
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 50;

        // 3. Validate pagination
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters",
            });
        }

        // 4. Get messages
        const messages = await getConversationMessages(
            conversationId,
            page,
            limit
        );

        // 5. Send response
        return res.status(200).json({
            success: true,
            messages,
            pagination: {
                page,
                limit,
                count: messages.length,
            },
        });
    } catch (error) {
        console.error("Get conversation messages error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};