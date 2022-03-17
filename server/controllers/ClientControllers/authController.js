import { v4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

export const loginClient = async (req, res) => {
  const { email, password } = req.body;
  const client = await User.findOne({ email });

  if (!client) {
    return res.status(422).send({ error: "Invalid Email or Password" });
  }

  bcrypt.compare(password, client.password, (err, success) => {
    if (!success) {
      return res.status(422).send({ error: "Invalid Email or Password" });
    } else {
      const token = jwt.sign(
        { user_id: client.user_id },
        process.env.MY_SECRET_ACCESS_TOKEN
      );
      return res
        .status(200)
        .json({ token, user_id: client.user_id, is_worker: client.is_worker });
    }
  });
};

export const registerClient = async (req, res) => {
  const data = req.body;
  let uuid = v4();

  const userFound = await User.findOne({ email: data.email });

  if (userFound) {
    return res.status(422).send({ error: "Email already in use" });
  }
  const hashedPass = await bcrypt.hash(data.password, 10);

  try {
    await User.create({
      user_id: uuid,
      first_name: data.firstName,
      middle_name: data.middleName,
      family_name: data.lastName,
      suffix: data.suffix,
      email: data.email,
      password: hashedPass,
      mobile_no: data.mobileNo,
      address: data.address,
      birthdate: data.dob,
      sex: data.sex,
      is_worker: data.isWorker,
      is_verified: false,
    });
    const token = jwt.sign(
      { user_id: uuid },
      process.env.MY_SECRET_ACCESS_TOKEN
    );
    return res
      .status(200)
      .json({ token, user_id: uuid, is_worker: data.isWorker });
  } catch (err) {
    return res.status(422).send({ error: "Error Creating User" });
  }
};

export const logoutClient = async (req, res) => {
  res.status(200).json({ message: `Logout user with ID: ${req.params.id}` });
};
