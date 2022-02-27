import { validationErrors } from '../../middleware/validations.js';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

import User from '../../models/userModel.js';

export const loginClient = async (req, res) => {
  validationErrors(res, req);

  const { email, password } = req.body;

  const client = await User.findOne({ email });

  if (!client) {
    return res.status(422).json({ error: `Incorrect email` });
  }

  bcrypt.compare(password, client.password, (err, success) => {
    if (!success) {
      return res.status(422).json({ error: `Incorrect password` });
    } else {
      return res.status(200).json({ data: client });
    }
  });
};

export const registerClient = async (req, res) => {
  const data = req.body;

  const hashedPass = await bcrypt.hash(req.body.password, 10);

  const client = await User.create({
    user_id: v4(),
    first_name: data.first_name,
    middle_name: data.middle_name,
    family_name: data.family_name,
    suffix: data.suffix,
    email: data.email,
    password: hashedPass,
    mobile_no: data.mobile_no,
    telephone: data.telephone,
    address: data.address,
    birthdate: data.birthdate,
    gender: data.gender,
    is_worker: data.is_worker
  }).catch((err) => res.status(422).json({ error: err }));

  res.status(200).json({ data: client });
};

export const logoutClient = async (req, res) => {
  res.status(200).json({ message: `Logout user with ID: ${req.params.id}` });
};
