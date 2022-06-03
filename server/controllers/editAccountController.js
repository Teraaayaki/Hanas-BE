import User from "../models/userModel.js";
import bucket from "../helpers/googleCloudStorage.js";
import dotenv from "dotenv";

dotenv.config();

export const uploadProfilePicture = async (req, res) => {
  console.log("File: ", req.file);
  if (!req.file) {
    return res.status(422).send({ error: "Error uploading file" });
  }

  // Create blobStream
  const blob = bucket.file(`users/${req.user._id}/${req.file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true,
  });

  // Error Handling
  blobStream.on("error", (error) => {
    console.log(error);
    return res.status(422).send({ error });
  });

  // Create File
  blobStream.on("finish", () => {
    const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${blob.name}`;

    return res.status(200).json({ publicUrl });
  });

  blobStream.end(req.file.buffer);
};
