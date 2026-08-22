import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"

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

app.use('/api/auth', authRoutes)

export default app;