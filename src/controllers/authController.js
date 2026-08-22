import bcrypt from "bcrypt";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Username and password are required"
                }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
            });

        }

        if (password.length < 8) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Password must me equal or greater than 8 digit"
                }
            )
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            passwordHash: hashPassword
        });
        return res.status(201).json(
            {
                success: true,
                message: "User created successfully",
                username,
                email
            }
        )
    }
    catch (err) {
        console.log(`error ${err}`);
        return res.status(500).json(
            {
                success: false,
                message: "User registration failed"
            }
        )
    }
}

const login = async (req, res) => {
    const EXPIRES_IN = process.env.EXPIRES_IN;
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Email and password are required"
                }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid credentials",
            });

        }

        if (password.length < 8) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid credentials"
                }
            )
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        const passMatch = await bcrypt.compare(password, user.passwordHash)

        if (passMatch) {
            const token = jwt.sign(
            {
                id: user._id,
            },
            JWT_SECRET,
            {
                expiresIn: EXPIRES_IN
            }
        );
        return res.status(200).json(
            {
                success:true,
                token,
                message:"User logged in",
                user: {
                    id:user._id,
                    email:user.email,
                    username:user.username
                }

            }
        )
        }
        else {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid credentials"
                })
        }

        
       
    }

    catch (err) {
        console.log(`error ${err}`);
        return res.status(500).json(
            {
                success: false,
                message: "Internal Server Error"
            }
        )
    }
}

const me = (req,res) =>{
    return res.status(200).json(
        {
            message:"middleware working successfully"
        }
    )
}

export {
    register, login, me
}