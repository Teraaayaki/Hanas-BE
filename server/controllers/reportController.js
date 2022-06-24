export const uploadImage = async (req, res) => {
  console.log(req.files);
  return res.status(200).json({ message: "Successfully submitted report!" });
};

export const createReport = async (req, res) => {
  if (!req.body.DATA) {
    return res.status(422).send({ error: "Missing Data" });
  }

  console.log(req.body.DATA);
  return res.status(200).json({ message: "Successfully submitted report!" });
};
