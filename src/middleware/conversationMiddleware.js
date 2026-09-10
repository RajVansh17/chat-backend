import { isConversationMember } from "../services/conversationService";


export const requireConversationMember = async (req,res) => {
    try{
        const userId = req.user.id;
        const conversationId = req.params.conversationId;
        const isMember = await isConversationMember(userId,conversationId)

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