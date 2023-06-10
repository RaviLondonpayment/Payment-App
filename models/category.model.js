import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

// const bycryptSalt = process.env.BYCRYPT_SALT;

const categorySchema = new Schema({
  image: {
    type: String,
  },
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  categoryDescription: {
    type: String,
  },
  colorCode: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  imageNumber: {
    type: String,
  },
});

export default mongoose.model("category", categorySchema);
