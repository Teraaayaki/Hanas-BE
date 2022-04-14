import Services from "../../models/serviceModel.js";
import MyService from "../../models/myServiceModel.js";
import bucket from "../../helpers/googleCloudStorage.js";
import dotenv from "dotenv";
import { v4 } from "uuid";

dotenv.config();

export const getServices = async (req, res) => {
  if (req.user) {
    let services = await Services.find();

    return res.status(200).json({ services });
  } else {
    return res.status();
  }
};

export const getMyServices = async (req, res) => {
  let my_services = await MyService.aggregate([
    { $match: { worker: req.user._id } },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceNameData",
      },
    },
  ]);

  return res.status(200).json({ my_services });
};

export const addService = async (req, res) => {
  if (!req.body) {
    return res.status(422).send({ error: "Error adding service" });
  }
  console.log(req.body);
  let service = await Services.findOne({ service_type: req.body.service });
  let user_id = req.user._id;
  let uuid = v4();
  // Create myservice object
  const myService = {
    my_service_id: uuid,
    worker: user_id,
    service: service._id,
    description: req.body.description,
    hourly_rate: req.body.ratePerHourValue,
    sample_works: req.body.sampleWorkImgUrl,
    certificates: req.body.certificateImgUrl,
    last_updated: req.body.lastUpdated,
  };
  //   insertIntoMyservice
  try {
    await MyService.create({ ...myService });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ error: "Error adding service" });
  }
};

export const editServices = async (req, res) => {
  if (!req.body) {
    return res.status(422).send({ error: "Error adding service" });
  }
  console.log(req.body);
  // Create myservice object
  const myService = {
    description: req.body.description,
    hourly_rate: req.body.ratePerHourValue,
    sample_works: req.body.sampleWorkImgUrl,
    certificates: req.body.certificateImgUrl,
    last_updated: req.body.lastUpdated,
  };
  //   insertIntoMyservice
  try {
    await MyService.updateOne({ _id: req.body.service_id }, { ...myService });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ error: "Error adding service" });
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

export const uploadImageCertificate = async (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(422).send({ error: "Error uploading file" });
  }

  const blob = bucket.file("service-certificates/" + req.file.originalname);
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
    console.log("Error deleting file in bucket", err);
    return res.status(422).send({ error: "Error deleting file" });
  }
};

export const deleteImageCertificate = async (req, res) => {
  if (!req.body.fileName) {
    console.log("No filename");
    console.log(req.body.fileName);
    return res.status(422).send({ error: "Error deleting file" });
  }
  let fileName = req.body.fileName;
  try {
    console.log("Deleting file in bucket");
    await bucket.file("service-certificates/" + fileName).delete();

    return res.status(200).json({ success: "Succesfully deleted file" });
  } catch (err) {
    console.log("Error deleting file in bucket", err);
    return res.status(422).send({ error: "Error deleting file" });
  }
};
