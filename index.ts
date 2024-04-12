import dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || '';

import express from 'express';
const app = express();

import mongoose from "mongoose";
const port = 3000;

import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";

import cors from "cors";
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/product", productRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect(
    DATABASE_URL, 
    { dbName: "prods_and_users" }
);