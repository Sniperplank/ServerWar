const mongoose = require('mongoose');

const profile = new mongoose.Schema({
    userID: { type: String, require: true, unique: false },
    serverID: { type: String, require: true, unique: false },
    name: { type: String },
    serverName: { type: String },
    health: { type: Number, default: 100 },
    shield: { type: Number, default: 0 },
    money: { type: Number, default: 1000 }
})

const model = mongoose.model('Profile', profile);

module.exports = model;