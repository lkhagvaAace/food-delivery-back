import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phoneNumber: Number,
  role: { type: String, enum: ["Admin", "User"] },
  avatarImg: String,
});

const User = model("User", userSchema);

export default User;
