import MyService from "../../models/myServiceModel.js";
import nodemailer from "nodemailer";

import { ObjectId } from "mongodb";

export const getCertificationList = async (req, res) => {
  let unfilteredCertificationList = await MyService.aggregate([
    {
      $project: {
        _id: 1,
        worker: 1,
        service: 1,
        updatedAt: 1,
        is_certified: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "worker",
        foreignField: "_id",
        as: "workerData",
        pipeline: [
          {
            $match: {
              is_worker: true,
            },
          },
          {
            $project: {
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
              is_worker: 1,
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
        ],
      },
    },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceData",
        pipeline: [
          {
            $project: {
              service_type: 1,
            },
          },
        ],
      },
    },
  ]);

  const certificationList = unfilteredCertificationList.filter(
    (cerificationItem) => {
      return cerificationItem.workerData[0].verificationData[0] !== undefined;
    }
  );

  return res.status(200).json({ certificationList });
};

export const getCertification = async (req, res) => {
  try {
    const unfilteredCertification = await MyService.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
        },
      },
      {
        $project: {
          sample_works: 0,
          createdAt: 0,
          __v: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "worker",
          foreignField: "_id",
          as: "workerData",
          pipeline: [
            {
              $match: {
                is_worker: true,
                is_verified: true,
              },
            },
            {
              $project: {
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
                is_worker: 1,
                email: 1,
                mobile_no: 1,
                address: 1,
                birthdate: 1,
                sex: 1,
                is_deactivated: 1,
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
                      valid_id: 1,
                      nbi_brgy_clearance: 1,
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
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceData",
          pipeline: [
            {
              $project: {
                image: 1,
                service_type: 1,
              },
            },
          ],
        },
      },
    ]);

    const certification = unfilteredCertification.filter((cerificationItem) => {
      return cerificationItem.workerData[0].verificationData[0] !== undefined;
    });

    return res.status(200).json({ certification });
  } catch (err) {
    console.log(err.message);
  }
};

export const acceptCertification = async (req, res) => {
  try {
    const updatedRecord = MyService.findOneAndUpdate(
      { _id: req.params.id },
      { is_certified: "Accepted" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          let fullname =
            updatedRecord.worker.first_name +
            " " +
            updatedRecord.worker.middle_name +
            " " +
            updatedRecord.worker.family_name;

          if (updatedRecord.suffix) {
            fullname.concat(" " + updatedRecord.worker.suffix);
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
            to: updatedRecord.worker.email,
            subject:
              updatedRecord.service.service_type + " Service Certification",
            text:
              "Your " +
              updatedRecord.service.service_type +
              " Service Certification Request has been Accepted.",
            html:
              "Good Day " +
              fullname +
              ", <br><br/><br> We would like to notify you that your service, " +
              updatedRecord.service.service_type +
              " service has been certified and is now visible to your clients. If you have any concerns, please do not hesitate to contact us.<br/>",
          };

          transporter.sendMail(mailData, (error) => {
            if (error) {
              return console.log("Send Mail " + error);
            }
          });

          return res.status(200).json({ updatedRecord });
        }
      }
    )
      .select({ sample_works: 0, __v: 0 })
      .populate("worker", "first_name middle_name family_name suffix email")
      .populate("service", "service_type");
  } catch (err) {
    console.log(err.message);
  }
};

export const rejectCertification = async (req, res) => {
  try {
    MyService.findOneAndUpdate(
      { _id: req.params.id },
      { is_certified: "Rejected" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          let fullname =
            updatedRecord.worker.first_name +
            " " +
            updatedRecord.worker.middle_name +
            " " +
            updatedRecord.worker.family_name;

          if (updatedRecord.suffix) {
            fullname.concat(" " + updatedRecord.worker.suffix);
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
            to: updatedRecord.worker.email,
            subject:
              updatedRecord.service.service_type + " Service Certification",
            text:
              "Your " +
              updatedRecord.service.service_type +
              " Service Certification Request has been Rejected.",
            html:
              "Good Day " +
              fullname +
              ", <br><br/><br> We would like to notify you that your Certification request for your " +
              updatedRecord.service.service_type +
              " service has been Rejected. Please check if you have uploaded the correct images, if the image quality is sufficiently readable and upload the correct images. If you think this is a mistake, please do not hesitate to contact us.<br/>",
          };

          transporter.sendMail(mailData, (error) => {
            if (error) {
              return console.log("Send Mail " + error);
            }
          });

          return res.status(200).json({ updatedRecord });
        }
      }
    )
      .select({ sample_works: 0, __v: 0 })
      .populate("worker", "first_name middle_name family_name suffix email")
      .populate("service", "service_type");
  } catch (err) {
    console.log(err.message);
  }
};

export const setPendingCertification = async (req, res) => {
  try {
    MyService.findOneAndUpdate(
      { _id: req.params.id },
      { is_certified: "Pending" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    )
      .select({ sample_works: 0, __v: 0 })
      .populate("worker", "first_name middle_name family_name suffix email")
      .populate("service", "service_type");
  } catch (err) {
    console.log(err.message);
  }
};
