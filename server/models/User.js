const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true       // no two users can have the same email
  },
  password: {
    type: String,
    required: true     // this will be stored as a bcrypt hash, never plain text
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter'],  // only these two values allowed
    default: 'candidate'
  }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);
console.log('User.js loaded, mongoose connection state:', mongoose.connection.readyState);