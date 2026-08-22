import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET= process.env.JWT_SECRET;


const authenticateToken = async (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json(
            {
                message:"unauthorized token"
            }
        )
    }

    try{
        const decodedUser = await jwt.verify(token, JWT_SECRET);
        req.user = decodedUser;
        next();

    }
    catch(err){
        return res.status(403).json({
            message:"Invalid or expired token"
        })
    }

}

export default authenticateToken;