import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });


userSchema.pre("save", async function () {
    // isModified -- mongoose built in method
    // password not changed, do nothing
    if (!this.isModified("password")) return;
    // bcrypt.hash() takes 2 parameters-- password, number of salt rounds
    // if password is changed, hash it
    this.password = await bcrypt.hash(this.password, 10);
});

// returs true or false
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


export default mongoose.model('User', userSchema);