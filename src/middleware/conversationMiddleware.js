import { isConversationMember } from "../services/conversationService.js";


export const requireConversationMember = async (req,res,next) => {
    try{
        const userId = req.user.id;
        const conversationId = req.params.conversationId;

        // console.log("Authenticated user:", userId);
        // console.log("Conversation ID:", conversationId);

        const isMember = await isConversationMember(userId,conversationId)

        // console.log("Is member:", isMember);

        if(!isMember){
            return res.status(403).json({
                success:false,
                message:"You are not a part of this convo",
            })
        }

        next();

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}