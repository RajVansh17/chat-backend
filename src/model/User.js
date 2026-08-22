import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },lastSeen: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);

export default User;