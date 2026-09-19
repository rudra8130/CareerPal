import mongoose from "mongoose";
import dns from "dns"

dns.setServers(['1.1.1.1', '8.8.8.8'])

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { family: 4 })
        console.log("Database Connected")
    }
    catch (error) {
        console.log("MongoDb error", error)
    }
}
