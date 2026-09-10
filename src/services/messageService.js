import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";

export const createMessage = async (
    conversationId,
    senderId,
    content
) => {
    const message = await Message.create({
        conversationId,
        senderId,
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