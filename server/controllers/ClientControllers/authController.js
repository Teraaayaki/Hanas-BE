import { v4 } from "uuid";
import bcrypt from "bcrypt";

import User from "../../models/userModel.js";

export const loginClient = async (req, res) => {
  const { email, password } = req.body;
  const client = await User.findOne({ email });

  if (!client) {
    return res.status(422).json({ error: `Email not found` });
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
  const hashedPass = await bcrypt.hash(data.password, 10);

  try {
    await User.create({
      user_id: v4(),
      first_name: data.firstName,
      middle_name: data.middleName,
      family_name: data.lastName,
      suffix: data.suffix,
      email: data.email,
      password: hashedPass,
      mobile_no: data.mobileNo,
      address: data.address,
      birthdate: data.dob,
      gender: data.gender,
      is_worker: data.isWorker,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(422).json({ success: false, err });
  }
};

export const logoutClient = async (req, res) => {
  res.status(200).json({ message: `Logout user with ID: ${req.params.id}` });
};
