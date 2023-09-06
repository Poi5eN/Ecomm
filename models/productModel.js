import mongoose from "mongoose";

//for create table into db
const productSchema = new mongoose.Schema({

    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: false }

}, {
    //for date
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;