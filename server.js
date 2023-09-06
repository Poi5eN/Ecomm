import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRouter from './routes/productsRoutes.js';
import userRouter from './routes/userRoutes.js';
import billsRouter from './routes/billsRoutes.js';
import path from 'path';

const __dirname = path.resolve();
//require('colors');

dotenv.config();



//Connect with MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err.message);
});

const app = express();

//middlewares

app.use(express.static(path.join(__dirname, "./client/build")));

app.set("*", function (_, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"), function(err) {
        res.status(500).json({success: false});
    })
})

app.use(cors());
app.use(express.json());

const name = Ajay


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan("dev"));

//routes
app.use('/api/products/', productRouter);
app.use('/api/users/', userRouter);
app.use('/api/bills/', billsRouter);

//Create Port 
const PORT = process.env.PORT || 5000;

//Listen
app.listen(PORT, () => {
    console.log(`Serve at running on the port: http://localhost:${PORT}`);
} )