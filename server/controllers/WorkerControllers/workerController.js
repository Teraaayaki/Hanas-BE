import Services from "../../models/serviceModel.js";
import bucket from "../../helpers/googleCloudStorage.js";
import dotenv from "dotenv";

dotenv.config();

export const getServices = async (req, res) => {
  if (req.user) {
    let services = await Services.find();

    return res.status(200).json({ services });
  } else {
    return res.status();
  }
};

export const uploadImageService = async (req, res) => {
  if (!req.file) {
    return res.status(422).send({ error: "Error uploading file" });
  }

  const blob = bucket.file("sample-work-images/" + req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true,
  });

  blobStream.on("error", (error) => {
    return res.status(422).send({ error });
  });

  blobStream.on("finish", () => {
    const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${blob.name}`;

    return res.status(200).json({ publicUrl });
  });

  blobStream.end(req.file.buffer);
};
