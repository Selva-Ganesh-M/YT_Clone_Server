import express from "express";
import { PORT } from "./utils/config";
import { connectToDB } from "./utils/connectToDb";
import authRouter from "./routers/auth"
import { customErrorHandler } from "./middlewares/customErrorHandler";
import cookieParser from "cookie-parser";
import { userRouter } from "./routers/user";
import videoRouter from "./routers/video";
import customReqLogger from "./utils/customRequestLogger";
import commentsRouter from "./routers/comment.route";

const server = express();

// middlewares
server.use(express.json())
server.use(cookieParser())
    //custom request logger
    server.use(customReqLogger);

// Routers
server.use("/api/auth", authRouter)
server.use("/api/users", userRouter)
server.use("/api/videos", videoRouter)
server.use("/api/comments", commentsRouter)



// custom error handler
server.use(customErrorHandler);


const startServer = async () => {
    try {
        await connectToDB();
        console.log("connected to mongoose.");
        server.listen(5000, ()=>console.log(`server started listening at port ${PORT}`)
        )
    } catch (error: any) {
        console.log(error.message);
        
    }
}
startServer();


