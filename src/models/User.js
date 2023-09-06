import { Schema, model } from "mongoose";

const UserSchema = new Schema({}, { timestamps: true });

const User = model("User", UserSchema);
export default User;
