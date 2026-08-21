import express from "express";
import cors from "cors";

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

export default app;