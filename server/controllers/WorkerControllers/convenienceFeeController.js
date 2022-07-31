import ConvFeeTransaction from "../../models/convFeeTransactionModel.js";

export const getConvFee = async (req, res) => {
  try {
    const convFeeData = await ConvFeeTransaction.findOne({
      worker: req.user._id,
    });

    res.status(200).json({ convFeeData });
  } catch (error) {
    res.status(422).send({ error });
  }
};
