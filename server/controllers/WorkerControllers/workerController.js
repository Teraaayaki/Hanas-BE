import Services from "../../models/serviceModel.js";
import bucket from "../../helpers/googleCloudStorage.js";

export const getServices = async (req, res) => {
  if (req.user) {
    let services = await Services.find();

    return res.status(200).json({ services });
  } else {
    return res.status();
  }
};

export const uploadImageService = async (req, res) => {
  console.log(req);
  console.log("File is: ", req.file);

  res.status(200).send("ok");
};
