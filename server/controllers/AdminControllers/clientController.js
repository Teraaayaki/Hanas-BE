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
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "reporter",
          as: "countReports",
          pipeline: [
            {
              $count: "Count",
            },
          ],
        },
      },
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "reporter",
          as: "countPendingReports",
          pipeline: [
            {
              $match: {
                status: "Pending",
              },
            },
            {
              $count: "Count",
            },
          ],
        },
      },
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "reporter",
          as: "countResolvedReports",
          pipeline: [
            {
              $match: {
                status: "Resolved",
              },
            },
            {
              $project: {
                status: 1,
              },
            },
            {
              $count: "Count",
            },
          ],
        },
      },
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "reporter",
          as: "countRejectedReports",
          pipeline: [
            {
              $match: {
                status: "Rejected",
              },
            },
            {
              $count: "Count",
            },
          ],
        },
      },
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "reporter",
          as: "reportsData",
          pipeline: [
            {
              $project: {
                message: 0,
                attachedImages: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
          ],
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
          let fullname =
            updatedRecord.first_name +
            " " +
            updatedRecord.middle_name +
            " " +
            updatedRecord.family_name;

          if (updatedRecord.suffix) {
            fullname.concat(" " + updatedRecord.suffix);
          }

          const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
              user: "hanas.app.services@gmail.com",
              pass: process.env.NODE_EMAILER_PASS,
            },
            secure: true,
            tls: {
              // do not fail on invalid certs
              rejectUnauthorized: false,
            },
          });

          const mailData = {
            from: "hanas.app.services@gmail.com",
            to: updatedRecord.email,
            subject: "Account Deactivation",
            text: "Your Hanas Account has beed deactivated.",
            html:
              "Good Day " +
              fullname +
              ",<br><br/><br>We would like to notify you that your account has been deactivated. If you think this is a mistake, please do not hesitate to contact us.<br/>",
          };

          transporter.sendMail(mailData, (error) => {
            if (error) {
              return console.log("Send Mail " + error);
            }
          });

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
          let fullname =
            updatedRecord.first_name +
            " " +
            updatedRecord.middle_name +
            " " +
            updatedRecord.family_name;

          if (updatedRecord.suffix) {
            fullname.concat(" " + updatedRecord.suffix);
          }

          const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
              user: "hanas.app.services@gmail.com",
              pass: process.env.NODE_EMAILER_PASS,
            },
            secure: true,
            tls: {
              // do not fail on invalid certs
              rejectUnauthorized: false,
            },
          });

          const mailData = {
            from: "hanas.app.services@gmail.com",
            to: updatedRecord.email,
            subject: "Account Reactivation",
            text: "Your Hanas Account has beed reactivated.",
            html:
              "Good Day " +
              fullname +
              ", <br><br/><br> We would like to notify you that your account has been reactivated. If you have any concerns, please do not hesitate to contact us.<br/>",
          };

          transporter.sendMail(mailData, (error) => {
            if (error) {
              return console.log("Send Mail " + error);
            }
          });

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

const clientDefault = async () => {
  const client = await User.aggregate([
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

  return Promise.all(client);
};

const sortAscendingHelper = async (sortValue) => {
  const client = await User.aggregate([
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
    { $sort: { [sortValue]: 1 } },
  ]);

  return Promise.all(client);
};

export const sortClient = async (req, res) => {
  const choice = req.body.choice;
  switch (choice) {
    case "all":
      try {
        const clientList = await clientDefault("all");

        return res.status(200).json({ clientList });
      } catch (error) {
        console.log(error);
      }

      break;
    case "name":
      try {
        const clientList = await sortAscendingHelper("name");

        return res.status(200).json({ clientList });
      } catch (error) {
        console.log(error);
      }

      break;

    case "date":
      try {
        const clientList = await sortAscendingHelper("createdAt");

        return res.status(200).json({ clientList });
      } catch (error) {
        console.log(error);
      }

      break;

    default:
      break;
  }
};

const filterHelper = async (filterValue) => {
  const client = await User.aggregate([
    {
      $match: {
        is_worker: false,
        is_deactivated: filterValue,
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

  return Promise.all(client);
};

export const filterClient = async (req, res) => {
  const choice = req.body.choice;
  switch (choice) {
    case "active":
      try {
        const clientList = await filterHelper(false);

        return res.status(200).json({ clientList });
      } catch (error) {
        console.log(error);
      }

      break;

    case "deactivated":
      try {
        const clientList = await filterHelper(true);

        return res.status(200).json({ clientList });
      } catch (error) {
        console.log(error);
      }

      break;

    case "all":
      try {
        const clientList = await clientDefault();

        return res.status(200).json({ clientList });
      } catch (error) {
        console.log(error);
      }

      break;

    default:
      break;
  }
};
