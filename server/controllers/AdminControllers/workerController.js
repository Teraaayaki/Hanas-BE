import User from "../../models/userModel.js";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";

export const getWorkerList = async (req, res) => {
  const workerList = await User.aggregate([
    {
      $match: {
        is_verified: true,
        is_worker: true,
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
        is_verified: 1,
        is_deactivated: 1,
        is_worker: 1,
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "verifications",
        localField: "_id",
        foreignField: "user_id",
        as: "verificationData",
        pipeline: [
          {
            $match: {
              verify_status: "Accepted",
            },
          },
          {
            $project: {
              verify_status: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "myservices",
        localField: "_id",
        foreignField: "worker",
        as: "myServicesData",
        pipeline: [
          {
            $match: {
              is_certified: "Accepted",
            },
          },
          {
            $project: {
              service: 1,
              is_certified: 1,
            },
          },
          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "servicesData",
              pipeline: [
                {
                  $project: {
                    service_type: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({ workerList });
};

export const getWorker = async (req, res) => {
  try {
    const worker = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
          is_verified: true,
          is_worker: true,
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
          is_verified: 1,
          profile_pic: 1,
          createdAt: 1,
        },
      },
      {
        $lookup: {
          from: "myservices",
          localField: "_id",
          foreignField: "worker",
          as: "myServicesData",
          pipeline: [
            {
              $match: {
                is_certified: "Accepted",
              },
            },
            {
              $project: {
                service: 1,
                is_certified: 1,
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service",
                foreignField: "_id",
                as: "servicesData",
                pipeline: [
                  {
                    $project: {
                      service_type: 1,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "verification",
          localField: "_id",
          foreignField: "worker",
          as: "verificationData",
          pipeline: [
            {
              $project: {
                valid_id: 1,
                nbi_brgy_clearance: 1,
              },
            },
          ],
        },
      },
    ]);
    return res.status(200).json({ worker });
  } catch (err) {
    console.log(err.message);
  }
};

export const deactivateWorker = async (req, res) => {
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
              ",<br><br>This email is composed to notify you that your account has been deactivated. If you think this is a mistake, please do not hesitate to contact us.<br/><br/>",
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

export const activateWorker = async (req, res) => {
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
