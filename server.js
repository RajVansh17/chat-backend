import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import app from "./src/app.js"
import dotenv from "dotenv";
import connectDB from "./src/config/connectDB.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;

const startServer = async () => {
    await connectDB(URL);

    app.listen(3000, () => {
        console.log("server started");
        try{
            console.log("DB connected");
        }
        catch(err){
            console.error(err);
        }
    });

}

startServer();