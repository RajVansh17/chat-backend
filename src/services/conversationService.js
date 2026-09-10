import Conversation from "../model/Conversation.js";
import User from "../model/User.js";

export const createConversation = async (currentUserId, targetUserId) => {
    try {
        const userExists = await User.findById(targetUserId);

        if (!userExists) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return 1;

        }


        if (currentUserId === targetUserId) {
            const error = new Error("You cannot create a conversation with yourself");
            error.statusCode = 400;
            return 2;
        }
        const existingConversation = await Conversation.findOne({
            members: {
                $all: [currentUserId, targetUserId],
            },
        });

        if (existingConversation) {
            return existingConversation;
        }

        const conversation = await Conversation.create({
            members: [currentUserId, targetUserId],
        });

        return conversation;
    }

    catch (err) {
        console.error("err", err)

        const error = new Error("Internal Server Error");
        error.statusCode = 500;
        throw error;
    }
}

export const getUserConversations = async (userId) => {
    try {
        const conversation = await Conversation.find({
            members: userId
        })
            .populate("members", "_id username")
            .sort({ updatedAt: -1 })

        if (!conversation) {
            const error = new Error("Conversation not found");
            error.statusCode = 404;
            throw error;
        }
        return conversation.map(
            (conversation) => {
                const otherMember = conversation.members.find(
                    (member) => member._id.toString() !== userId.toString()
                );

                return {
                    id: conversation._id,
                    otherUser: otherMember
                        ? {
                            id: otherMember._id,
                            username: otherMember.username
                        }
                        : null,
                    createdAt: conversation.createdAt,
                    updatedAt: conversation.updatedAt,
                };

            }
        );
    }
    catch (err) {
        console.log(err);
        const error = new Error("Internal Server Error");
        error.statusCode = 500;
        throw error;
    }
};

export const isConversationMember= async (userId, conversationId) => {
    const conversation = await Conversation.find({
        _id: conversationId,
        member: userId, 
    })

    return !!conversation;
};