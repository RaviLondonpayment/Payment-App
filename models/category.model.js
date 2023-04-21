import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

// const bycryptSalt = process.env.BYCRYPT_SALT;

const categorySchema = new Schema({
  image: {
    type: Image,
  },
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: {
    type: String,
    required: true,
  },
  colorCode: {
    type: String,
  },
});

export default mongoose.model("user", categorySchema);
