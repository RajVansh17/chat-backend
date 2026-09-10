import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            required: true,
            validate: {
                validator: function (members) {
                    return members.length === 2;
                },
                message: "A conversation must have exactly 2 members.",
            },
        },
    },
    {
        timestamps: true,
    }
);

conversationSchema.index({ members: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;