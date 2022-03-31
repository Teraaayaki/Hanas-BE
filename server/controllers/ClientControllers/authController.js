import { v4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import OtpNumber from "../../models/otpNumberModel.js";

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

export const verifyNumberClient = async (req, res) => {
  let { number } = req.body;
  const client = await User.findOne({ mobile_no: number });

  const otp = Math.floor(Math.random() * 8999 + 1000);

  if (!client) {
    try {
      await OtpNumber.create({
        expiresAt: new Date(),
        otp,
        number,
      });
      // send otp to number logic here
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(409).send({ error: "Maximum allowable request reached" });
    }
  } else {
    res.status(401).send({ error: "Number already registered" });
  }
};

export const verifyNumberOtpClient = async (req, res) => {
  let { otp, number } = req.body;
  const verified = await OtpNumber.findOne({ otp, number });

  if (!verified) {
    res.status(401).send({ error: "Incorrect OTP submitted" });
  } else {
    await OtpNumber.deleteOne({ number });
    res.status(200).json({ success: true });
  }
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
