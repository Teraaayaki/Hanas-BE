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
  console.log(req.file);
  if (!req.file) {
    return res.status(422).send({ error: "Error uploading file" });
  }

  const blob = bucket.file("sample-work-images/" + req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true,
  });

  blobStream.on("error", (error) => {
    console.log(error);
    return res.status(422).send({ error });
  });

  blobStream.on("finish", () => {
    const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${blob.name}`;

    return res.status(200).json({ publicUrl });
  });

  blobStream.end(req.file.buffer);
};

export const deleteImageService = async (req, res) => {
  if (!req.body.fileName) {
    console.log("No filename");
    console.log(req.body.fileName);
    return res.status(422).send({ error: "Error deleting file" });
  }
  let fileName = req.body.fileName;
  try {
    console.log("Deleting file in bucket");
    await bucket.file("sample-work-images/" + fileName).delete();

    return res.status(200).json({ success: "Succesfully deleted file" });
  } catch (err) {
    console.log("Error deleting file in bucket");
    return res.status(422).send({ error: "Error deleting file" });
  }
};
