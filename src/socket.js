import { Server } from "socket.io"
import { isConversationMember } from "./services/conversationService.js";
import jwt from "jsonwebtoken";

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },

    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            )

            socket.user = decoded;


            next()
        }
        catch (err) {
            console.log("Socket authentication error: ", socket.err);

            return next(new Error("Invalid or expired token"));
        }
    })

    io.on("connection", (socket) => {
        console.log("Socket Connected", socket.id);

        //check if the user belongs to the conversation or not
        socket.on("joinConversation", async (conversationId) => {
            try {

                const room = `conversation:${conversationId}`;

                const isMember = await isConversationMember(socket.user.id, conversationId);
                console.log(isMember);

                if (!isMember) {
                    socket.emit("joinConversationError", {
                        message: "You are not a member of this conversation"
                    }
                    );

                    return;
                }
                //join only if the user is authenticated
                socket.join(room);

                console.log(`${socket.user.id} joined ${room}`)
            }
            catch (error) {
                console.error("Join conversation error:", error);

                socket.emit("joinConversationError", {
                    message: "Unable to join conversation",
                });
            }
        });

        //sending message event
        socket.on("message:send", async (data) => {
            try {
                const { conversationId, content } = data;

                if (!conversationId || typeof content !== "string") {
                    return socket.emit("message:error", {
                        message: "Invalid message data",
                    });
                }
                // check user authentication
                const isMember = await isConversationMember(
                    socket.user.id,
                    conversationId
                );

                if (!isMember) {
                    return socket.emit("message:error", {
                        message: "You are not a member of this conversation",
                    });
                }

                const trimmedContent = content.trim();

                if (!trimmedContent) {
                    return socket.emit("message:error", {
                        message: "Message cannot be empty",
                    });
                }

                if (trimmedContent.length > 2000) {
                    return socket.emit("message:error", {
                        message: "Message cannot exceed 2000 characters",
                    });
                }
                // create message in the database
                const message = await createMessage(
                    conversationId,
                    socket.user.id,
                    trimmedContent
                );

                console.log("Message created:", message._id);
                // sending message to the user 
                io.to(`conversation:${conversationId}`).emit("message:new", {
                    id: message._id,
                    conversationId: message.conversation,
                    senderId: message.sender,
                    content: message.content,
                    createdAt: message.createdAt,
                });
            } catch (error) {
                console.error("Send message error:", error);

                socket.emit("message:error", {
                    message: "Unable to send message",
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnect");
        });
    });

    return io;
}