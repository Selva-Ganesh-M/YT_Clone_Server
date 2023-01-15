import express from "express";
import { PORT } from "./utils/config";
import { connectToDB } from "./utils/connectToDb";

const server = express();


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
