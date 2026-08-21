import mongoose from "mongoose";

const connectDB = async (URL) => {
    try{
        const conn = await mongoose.connect(URL);
        console.log("Database connected successfully")
    }
    catch(err){
        console.log(`DB connection faild ${err}`);
    }
}

export default connectDB;
