const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String, // Store password securely (hashed)
    dateJoined: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
