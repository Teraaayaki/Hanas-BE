import ConvFeeTransaction from "../../models/convFeeTransactionModel.js";

import { ObjectId } from "mongodb";

export const getConvFeeTransactions = async (req, res) => {

  const convFeeTransactions = await ConvFeeTransaction.find().populate("worker", "first_name middle_name family_name");

  return res.status(200).json({ convFeeTransactions });
};

export const setToPaid = async (req, res) => {
    console.log(req.body);
    try{
        const paymentDetails = { date: new Date(), amount: req.body.DATA.amount}
        ConvFeeTransaction.findOneAndUpdate(
            { _id: req.body.DATA.id},
            { total_paid: req.body.DATA.amount, total_amount: 0, $push: { payments: paymentDetails} },
            (error, updatedRecord) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.status(200).json({ updatedRecord });
                }
            }
        )
    }catch (err){
        console.log(err.message);
    }
    
}