import mongoose from "mongoose"
import { EN_VARS } from "./enVars.js"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(EN_VARS.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB