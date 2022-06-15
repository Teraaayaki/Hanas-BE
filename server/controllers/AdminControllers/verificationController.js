import User from "../../models/userModel.js";
import Verification from "../../models/verificationModel.js";

import { ObjectId } from "mongodb";

//Verifications----------------------------------------
export const getVerifications = async (req, res) => {

  try{
    const verifications = await Verification.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'user_id', 
          foreignField: '_id', 
          as: 'workerData', 
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
                    " ",
                    "$suffix",
                  ],
                },
                createdAt: 1,
                email: 1,
                mobile_no: 1,
                address: 1,
                birthdate: 1,
                is_verified: 1,
                profile_pic: 1,
                verify_status: 1,
                createdAt: 1,
              },
            }
          ]
        }
      }
    ]);

    return res.status(200).json({ verifications });

  } catch( error ){
    console.log(error);
  }
  

};

export const getSpecificVerification = async (req, res) => {
  try {
    const specific_verification = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
          is_verified: false,
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
        },
      },
    ]);

    return res.status(200).json({ specific_verification });
  } catch (err) {
    console.log(err.message);
  }
};

export const acceptVerification = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { is_verified: true, verify_status: "Accepted" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          console.log(updatedRecord);
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ password: 0, __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};

export const rejectVerification = async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { is_verified: false, verify_status: "Rejected" },
      { new: true },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          console.log(updatedRecord);
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ password: 0, __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};
