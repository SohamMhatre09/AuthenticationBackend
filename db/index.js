const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    username: String,
    password: String,
    email: String
});

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
module.exports = {
    User,Admin
};
