import io from '../socket.js';
import jwt from 'jwt';
import { configDotenv } from 'dotenv';
configDotenv();

io.use((socket,next ) => {
    try{
        const token = socket.handshake.auth.token;

        if(!token){
            return next(new Error("Authentication required"));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
            
        socket.user = decoded;
    }
    catch(err){
        console.log("Socket authentication error: ", socket.err);

        return next(new Error("Invalid or expired token"));
    }
})

