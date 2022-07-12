import uploadImage from "../helpers/uploadImage.js";
import Report from "../models/reportModel.js";

export const uploadImageAttachment = async (req, res) => {
  //   console.log("req.files", req.files);
  if (!req.files) {
    return res.status(422).send({ error: "Missing Data" });
  }

  const publicImageUrl = req.files.map(
    async (item) => await uploadImage(item, `reports/${req.user._id}/`)
  );

  try {
    const publicUrls = await Promise.all(publicImageUrl);
    return res.status(200).json({ publicUrls });
  } catch (err) {
    console.log("uploadImageAttachment Error", err);
    return res.status(422).send({ error: "Error Uploading Images" });
  }
};

export const createReport = async (req, res) => {
  if (!req.body.DATA) {
    return res.status(422).send({ error: "Missing Data" });
  }
  //   console.log("req.body.DATA", req.body.DATA);
  const { message, concern, images } = req.body.DATA;

  try {
    await Report.create({
      reporter: req.user._id,
      message,
      concern,
      attached_images: images,
    });
    return res.status(200).json({ message: "Successfully submitted report!" });
  } catch (err) {
    console.log("createReport Error", err);
    return res.status(422).send({ error: "Error creating report" });
  }
};
