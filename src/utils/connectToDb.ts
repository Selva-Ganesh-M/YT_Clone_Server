import mongoose from "mongoose"
import { MONGO_URI } from "./config"

export const connectToDB = async () => {
    mongoose.connect(MONGO_URI!).catch((error)=>{throw error})
}