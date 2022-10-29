const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required:true,
        trim: true
    },
    lname: {
        type: String,
        required:[true,"Enter last name"],
        trim: true
    },

    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email required"]

    },

    password: {
        type: String,
        required: true,
        minLength: 8

    }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);

