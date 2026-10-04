import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";

export const createMessage = async (
    conversationId,
    senderId,
    content
) => {
    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        content
    });

    await Conversation.findByIdAndUpdate(
        conversationId,
        {
            $set: {
                updatedAt: new Date(),
            },
        }
    );

    return message;
}

export const getConversationMessages = async (
    conversationId,
    page = 1,
    limit = 50
) => {
    const skip = (page - 1)*limit;

    const messages = await Message.find({
        conversation: conversationId
    })
        .sort({createdAt:1})
        .skip(skip)
        .limit(limit)
        .populate("sender", "_id username");

    return messages;
};

