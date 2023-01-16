import express from "express";
import { PORT } from "./utils/config";
import { connectToDB } from "./utils/connectToDb";
import authRouter from "./routers/auth"
import { customErrorHandler } from "./middlewares/customErrorHandler";
import cookieParser from "cookie-parser";

const server = express();

// middlewares
server.use(express.json())
server.use(cookieParser())

// Routers
server.use("/api/auth", authRouter)

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


