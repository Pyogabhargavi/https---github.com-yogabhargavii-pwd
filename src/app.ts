import express from 'express';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./routes/user.routes";
import Logger from "./loggers";

dotenv.config();
const port = process.env.PORT

const app = express(); 
app.use(express.json());
app.use("/", userRoutes);
const mongoURL = process.env.MONGO_URL;

if(!mongoURL){
    throw new Error("MongoDB URL not found")
}
mongoose.connect(mongoURL);
Logger.info("DB connected successfully")
app.listen(process.env.PORT, () => {
    console.log(`Server started at PORT ${port}`)
    Logger.info(`Server started at PORT ${port}`)
});
