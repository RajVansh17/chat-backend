import User from "../model/User.js";


export const searchUsers = async (req, res) => {
    try {
        const search = req.query.search?.trim();

        if (!search) {
            return res.status(200).json({
                success: true,
                users: []
            })
        }
        const users = await User.find({
            username: {
                $regex: search,
                $options: "i",
            },
        })
            .select("_id username")
            .limit(20);
            
            return res.status(200).json(
                {
                    success: true,
                    // user: users.toString()
                    users: users.map((user) => ({
                    id: user._id,
                    username: user.username
                    
                })
            ),
            }
        )
    }
    catch(err){
        console.error(err);

        return res.status(500).json(
            {
                success:false,
                message:"Internal Server Error"
            }
        );
    }

}