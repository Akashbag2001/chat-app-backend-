import express from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
const app = express();
// const PORT = 5001;
dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.use("/api/auth",authRoutes)

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})