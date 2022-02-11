const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
      required: true
    },
    first_name: {
      type: String,
      required: true
    },
    middle_name: {
      type: String
    },
    family_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      min: [8, 'Password must contain at least 8 characters.']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
