const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/userModel');

const validationErrors = (res, req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  }
};

const loginClient = asyncHandler(async (req, res) => {
  validationErrors(res, req);

  const { email, password } = req.body;

  const client = await User.findOne({ email });

  if (!client) {
    return res.status(422).json({ message: `Incorrect email` });
  }

  bcrypt.compare(password, client.password, (err, success) => {
    if (!success) {
      return res.status(422).json({ message: `Incorrect password` });
    } else {
      return res
        .status(200)
        .json({ message: `Login client with email: ${req.body.email}` });
    }
  });
});

const registerClient = asyncHandler(async (req, res) => {
  validationErrors(res, req);

  const { firstname, middlename, lastname, email, password } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  const client = await User.create({
    user_id: v4(),
    first_name: firstname,
    middle_name: middlename,
    family_name: lastname,
    email: email,
    password: hashedPass
  });

  res.status(200).json({ data: client });
});

const logoutClient = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Logout user with ID: ${req.params.id}` });
});

module.exports = {
  loginClient,
  registerClient,
  logoutClient
};
