import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const bcryptSalt = process.env.BYCRYPT_SALT;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
  },
  shopAddress: {
    type: String,
  },
  country: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
  this.password = hash;
  next();
});
export default mongoose.model("user", userSchema);
