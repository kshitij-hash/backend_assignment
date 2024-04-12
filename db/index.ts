import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    userId: String,
})

export const User = mongoose.model('User', userSchema);
export const Product = mongoose.model('Product', productSchema);
