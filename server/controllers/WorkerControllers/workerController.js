import Feedback from "../../models/feedbackModel.js";
import uploadImage from "../../helpers/uploadImage.js";

export const getFeedback = async (req, res) => {
  let worker_id = req.user._id;

  let feedback = await Feedback.aggregate([
    { $match: { worker: worker_id } },
    {
      $lookup: {
        from: "users",
        localField: "client",
        foreignField: "_id",
        as: "clientNameData",
        pipeline: [
          {
            $project: {
              name: {
                $concat: [
                  "$first_name",
                  " ",
                  "$middle_name",
                  " ",
                  "$family_name",
                ],
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "myservices",
        localField: "my_service_id",
        foreignField: "_id",
        as: "myServicesData",
        pipeline: [
          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "serviceNameData",
              pipeline: [{ $project: { service_type: 1 } }],
            },
          },
          {
            $project: {
              hourly_rate: 1,
              serviceNameData: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        rate: 1,
        clientNameData: 1,
        myServicesData: 1,
      },
    },
  ]);

  return res.status(200).json({ feedback });
};

export const createVerificationRequest = async (req, res) => {
  console.log(req.files);

  const publicIdUrl = req.files.validId.map(
    async (item) =>
      await uploadImage(item, `verifications/${req.user._id}/validId/`)
  );

  const publicClearanceUrl = req.files.clearance.map(
    async (item) =>
      await uploadImage(item, `verifications/${req.user._id}/clearance/`)
  );

  try {
    const publicIdUrls = await Promise.all(publicIdUrl);
    const publicClearanceUrls = await Promise.all(publicClearanceUrl);
    console.log("Public Urls", publicIdUrls);
    console.log("Public Clearance Urls", publicClearanceUrls);

    res.status(200).json({ message: "Successfully created request" });
  } catch (error) {
    console.log(error);
  }
};
