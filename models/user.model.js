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
  },
  ownerName: {
    type: String,
    required: true,
  },
  shopAddress: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  subscribed: {
    type: Boolean,
  },
  image: {
    type: String,
  },
  userRole: {
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
