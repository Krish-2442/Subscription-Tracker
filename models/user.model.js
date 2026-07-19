import mongoose from "mongoose";

// Schema : define the structure of document
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: 25,
        minLength: 3,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is unique"],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
    }
}, { timestamps: true });

// model("ModelName", schema) : provides method to interact with MongoDB collection and perform operations like create(), find(), update(), delete() etc.
// User is model object
const User = mongoose.model("User", userSchema);
export default User;