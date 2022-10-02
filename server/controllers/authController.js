import { v4 } from "uuid";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import OtpNumber from "../models/otpNumberModel.js";
import OtpEmail from "../models/otpEmail.js";
import twilio from "../helpers/twilio.js";
import transporter from "../helpers/nodeEmailer.js";
import { ObjectId } from "mongodb";

dotenv.config();

// LOGIN
export const loginClient = async (req, res) => {
  const { email, password } = req.body;
  const client = await User.findOne({ email });
  let user = {};

  // USER IS NOT FOUND
  if (!client) {
    return res.status(422).send({ error: "Invalid Email or Password" });
  }

  // DEACTIVATION NOTICE
  if (client.is_deactivated) {
    return res.status(422).send({ error: "User has been deactivated!" });
  }

  // USER IS FOUND
  if (client) {
    user = {
      id: client._id,
      first_name: client.first_name,
      middle_name: client.middle_name,
      last_name: client.family_name,
      suffix: client.suffix,
      email: client.email,
      mobile_no: client.mobile_no,
      address: client.address,
      birthdate: client.birthdate,
      sex: client.sex,
      is_verified: client.is_verified,
      profile_pic: client.profile_pic,
      pending_verification: client.pending_verification,
      push_token: client.push_token,
    };
  }

  bcrypt.compare(password, client.password, (err, success) => {
    if (!success) {
      return res.status(422).send({ error: "Invalid Email or Password" });
    } else {
      const token = jwt.sign(
        { user_id: client.user_id },
        process.env.MY_SECRET_ACCESS_TOKEN
      );
      return res.status(200).json({
        token,
        is_worker: client.is_worker,
        user,
      });
    }
  });
};

// VERIFY NUMBER USER
export const verifyNumberClient = async (req, res) => {
  let { number } = req.body;
  const client = await User.findOne({ mobile_no: number });

  const otp = Math.floor(Math.random() * 8999 + 1000);

  if (client) {
    return res.status(401).send({ error: "Number already registered" });
  }

  try {
    await OtpNumber.create({
      expiresAt: new Date(),
      otp,
      number,
    });

    await twilio.messages.create({
      body: `YOUR OTP CODE: ${otp}`,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: `+63${number}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(422)
      .send({ error: "Maximum allowable requests reached" });
  }
};

// RESEND CODE

export const resendCodeClient = async (req, res) => {
  let { number } = req.body;
  const otp = Math.floor(Math.random() * 8999 + 1000);

  try {
    await OtpNumber.findOneAndUpdate(
      { number },
      { otp, expiresAt: new Date() },
      { upsert: true }
    );

    await twilio.messages.create({
      body: `YOUR OTP CODE: ${otp}`,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: `+63${number}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(422).send({ error: "Error Sending Code" });
  }
};

// VERIFY OTP USER
export const verifyNumberOtpClient = async (req, res) => {
  let { otp, number } = req.body;
  const verified = await OtpNumber.findOne({ otp, number });

  if (!verified) {
    return res.status(401).send({ error: "Incorrect OTP submitted" });
  } else {
    await OtpNumber.deleteOne({ number });
    return res.status(200).json({ success: true });
  }
};

// REGISTER USER
export const registerClient = async (req, res) => {
  const data = req.body;
  let uuid = v4();

  const userFound = await User.findOne({ email: data.email });

  if (userFound) {
    return res.status(422).send({ error: "Email already in use" });
  }
  const hashedPass = await bcrypt.hash(data.password, 10);

  try {
    const newUser = await User.create({
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
    return res.status(200).json({
      token,
      is_verified: false,
      is_worker: data.isWorker,
      user_id: newUser._id,
    });
  } catch (err) {
    return res.status(422).send({ error: "Error Creating User" });
  }
};

export const logoutClient = async (req, res) => {
  return res
    .status(200)
    .json({ message: `Logout user with ID: ${req.params.id}` });
};

export const getDetails = async (req, res) => {
  if (req.user) {
    const user = {
      id: req.user._id,
      first_name: req.user.first_name,
      middle_name: req.user.middle_name,
      last_name: req.user.family_name,
      suffix: req.user.suffix,
      email: req.user.email,
      mobile_no: req.user.mobile_no,
      address: req.user.address,
      birthdate: req.user.birthdate,
      sex: req.user.sex,
      is_verified: req.user.is_verified,
      profile_pic: req.user.profile_pic,
      pending_verification: req.user.pending_verification,
      push_token: req.user.push_token,
    };
    return res.status(200).json({ user });
  } else {
    return res.status(422).send({ error: "Invalid Data" });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  let admin_info = {};

  if (!admin) {
    return res.status(422).send({ error: "Invalid Email or Password" });
  } else {
    const { first_name, middle_name, family_name } = admin;

    admin_info = {
      email,
      name: `${first_name} ${middle_name} ${family_name}`,
    };
  }

  bcrypt.compare(password, admin.password, (err, success) => {
    if (!success) {
      return res.status(422).send({ error: "Invalid Email or Password" });
    } else {
      const token = jwt.sign(
        { admin_id: admin._id },
        process.env.MY_SECRET_ACCESS_TOKEN
      );
      return res.status(200).json({ admin_info, token });
    }
  });
};

export const forgotPassAdmin = async (req, res) => {
  const { password } = req.body;

  const id = new ObjectId("624cfc3421411e228b249f14");
  const admin = await Admin.findOne({ _id: id });

  if (admin) {
    try {
      const hashedPass = await bcrypt.hash(password, 10);

      const updatedUser = await Admin.findOneAndUpdate(
        { _id: id },
        { password: hashedPass }
      );

      const mailData = {
        from: "hanas.app.services@gmail.com", // kinsa ang ga send
        to: admin.email, // ang mga mu receive sa email
        subject: "Password Change",
        text: "Successful password change",
        html: "<b>Good Day! </b> <br> This email is to notify you that the admin account has been successfully changed to a newer password. If this is not you, please contact the developers immediately as soon as possible.<br/>",
      };

      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          return console.log(error);
        }

        res.status(200).send({
          message: "Email sent",
          message_id: info.messageId,
          accepted: info.accepted,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  return res
    .status(200)
    .json({ success: "Password has been successfully updated" });
};

export const editPassword = async (req, res) => {
  // const {old_pass, new_pass, confirm_pass, _id, email} = req.body; //used for the postman
  const { old_pass, new_pass, confirm_pass } = req.body.DATA.values; //used for the actual data
  const { _id, email } = req.body.DATA; //used for the actual data

  const user = await User.findOne({ _id: _id });

  if (!user) {
    return res.status(406).send({ error: "User not found" });
  } else {
    bcrypt.compare(old_pass, user.password, async (err, success) => {
      if (success === true) {
        if (new_pass === confirm_pass) {
          try {
            const hashedPass = await bcrypt.hash(new_pass, 10);

            const mailData = {
              from: "hanas.app.services@gmail.com", // kinsa ang ga send
              to: email, // ang mga mu receive sa email
              subject: "Password Change",
              text: "Successful password change",
              html: "<b>Good Day! </b> <br> This email is to notify you that your account has been successfully changed to a newer password. If this is not you please contact administration as soon as possible.<br/>",
            };

            const updatedUser = await User.findOneAndUpdate(
              { _id: _id },
              { password: hashedPass }
            );

            transporter.sendMail(mailData, (error, info) => {
              if (error) {
                return console.log(error);
              }

              res.status(200).send({
                message: "Email sent",
                message_id: info.messageId,
                accepted: info.accepted,
              });
            });

            return res
              .status(200)
              .json({ success: "Password has been successfully updated" });
          } catch (err) {
            console.log(err);
            return res.status(422).send({ error: "Error Updating Password" });
          }
        } else {
          return res.status(400).send({ error: "Passwords do not match" });
        }
      } else {
        return res.status(406).send({ error: "Old password is incorrect" });
      }
    });
  }
};

export const forgotPassEmail = async (req, res) => {
  const { email, resend } = req.body;

  // if request is a not resend. which means first screen of forgot password.
  // must return error if otp is present
  if (!resend) {
    const otpFound = await OtpEmail.findOne({ email });

    if (otpFound) {
      return res.status(400).send({
        error:
          "Maximum allowable requests made. Please try again in 5 minutes.",
      });
    }
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({ error: "Email not registered." });
  }

  try {
    const otp = Math.floor(Math.random() * 8999 + 1000);

    const mailData = {
      from: "hanas.app.services@gmail.com",
      to: email,
      subject: "Forgot Password",
      text: "Requesting Password Change",
      html: `<b>Good Day!</b>
            <br>
            <br>
            You have requested to change your password.
            Here is your OTP code to change your password <b>${otp}</b>. 
            Do not share it with anyone else.
            If this is not you please contact administration as soon as possible.
            <br/>
            <br>
            \n
            Hanas Team`,
    };

    await transporter.sendMail(mailData);

    await OtpEmail.findOneAndUpdate(
      { email },
      {
        expiresAt: Date.now(),
        otp,
      },
      { upsert: true }
    );

    return res.status(200).json({ message: "OTP sent!" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Error sending OTP to email." });
  }
};

export const forgotPassOtp = async (req, res) => {
  let { otp, email } = req.body;
  const verified = await OtpEmail.findOne({ otp, email });

  // OTP does not match or not present
  if (!verified) {
    return res.status(401).send({ error: "Error Verifying OTP" });
  }

  // OTP Verified delete existing records of OTP
  await OtpEmail.deleteOne({ otp, email });

  return res.status(200).json({ message: "Successfully Verified OTP!" });
};

export const forgotPassChange = async (req, res) => {
  const { email, new_pass, confirm_pass } = req.body;

  const user = await User.findOne({ email });

  // User does not exist
  if (!user) {
    return res.status(400).send({ error: "Email not registered." });
  }

  // Passwords do not match
  if (new_pass !== confirm_pass) {
    return res.status(422).send({ error: "Password Error" });
  }

  try {
    const hashedPass = await bcrypt.hash(new_pass, 10);

    const mailData = {
      from: "hanas.app.services@gmail.com",
      to: email,
      subject: "Password Change",
      text: "Successful password change",
      html: `<b>Good Day! </b> 
            <br> 
            <br>
            This email is to notify you that your account has been 
            successfully changed to a newer password. 
            If this is not you please contact administration as soon as possible.
            <br/>
            <br>
            \n
            Hanas Team`,
    };

    await transporter.sendMail(mailData);

    await User.findOneAndUpdate({ email }, { password: hashedPass });

    return res.status(200).json({ message: "Succesfully Changed Password!" });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ error: "Change Password Error" });
  }
};
