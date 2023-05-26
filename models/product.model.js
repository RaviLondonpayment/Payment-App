import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

// const bycryptSalt = process.env.BYCRYPT_SALT;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
  },
  quantity: {
    type: Number,
  },
  kilogram: {
    type: String,
  },
  price: {
    type: Number,
  },
  manufacturingDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  description: {
    type: String,
  },
  offer: {
    type: String,
  },
  barCode: {
    type: String,
  },
  offerPrice: {
    type: Number,
  },
});

export default mongoose.model("product", productSchema);
