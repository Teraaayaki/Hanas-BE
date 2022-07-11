import User from "../../models/userModel.js";
import nodemailer from "nodemailer";

import { ObjectId } from "mongodb";

export const getClientList = async (req, res) => {
  const clientList = await User.aggregate([
    {
      $match: {
        is_worker: false,
      },
    },
    {
      $project: {
        user_id: 1,
        profile_pic: 1,
        name: {
          $concat: [
            "$first_name",
            " ",
            "$middle_name",
            " ",
            "$family_name",
            " ",
            "$suffix",
          ],
        },
        address: 1,
        is_worker: 1,
        is_deactivated: 1,
        createdAt: 1,
      },
    },
  ]);

  return res.status(200).json({ clientList });
};

export const getClient = async (req, res) => {
  try {
    const client = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
          is_worker: false,
        },
      },
      {
        $project: {
          user_id: 1,
          first_name: 1,
          middle_name: 1,
          family_name: 1,
          suffix: 1,
          name: {
            $concat: [
              "$first_name",
              " ",
              "$middle_name",
              " ",
              "$family_name",
              " ",
              "$suffix",
            ],
          },
          email: 1,
          mobile_no: 1,
          address: 1,
          birthdate: 1,
          sex: 1,
          is_worker: 1,
          is_deactivated: 1,
          profile_pic: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({ client });
  } catch (err) {
    console.log(err.message);
  }
};

export const deactivateClient = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { is_deactivated: true },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          const nodemailer = require("nodemailer");
          let fullname =
            updatedRecord.first_name +
            " " +
            updatedRecord.middle_name +
            " " +
            updatedRecord.family_name;
          if (updatedRecord.suffix) {
            fullname.concat(" " + updatedRecord.suffix);
          }
          fullname.concat(",<br><br>");

          const mailData = {
            from: "hanas.app.services@gmail.com",
            to: updatedRecord.email,
            subject: "Account Deactivation",
            text: "Your Hanas Account has beed deactivated.",
            html:
              "Good Day" +
              fullname +
              "This email is composed to notify you that your account has been deactivated. If you think this is a mistake, please do not hesitate to contact us.<br/><br/>",
          };

          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({
      password: 0,
      __v: 0,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const activateClient = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { is_deactivated: false },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({
      password: 0,
      __v: 0,
    });
  } catch (err) {
    console.log(err.message);
  }
};
