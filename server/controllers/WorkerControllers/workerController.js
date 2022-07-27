import Feedback from "../../models/feedbackModel.js";
import Verification from "../../models/verificationModel.js";
import User from "../../models/userModel.js";
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
              profile_pic: 1,
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
  if (!req.files.validId || !req.files.clearance) {
    res.status(422).send({ error: "Error missing photos" });
  }

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

    await Verification.create({
      user_id: req.user._id,
      valid_id: publicIdUrls,
      nbi_brgy_clearance: publicClearanceUrls,
    });

    await User.updateOne(
      { _id: req.user._id },
      { pending_verification: true },
      { runValidators: true }
    );

    res
      .status(200)
      .json({ message: "Successfully created verification request" });
  } catch (error) {
    console.log(error);
    res.status(422).send({ error: "Error uploading photos" });
  }
};
