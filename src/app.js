import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import convoRoutes from "./routes/convoRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req,res) => {
    console.log("api started")
    res.status(200).json
    ({
        success:true,
        message: "server working correctly",
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', convoRoutes);

export default app;