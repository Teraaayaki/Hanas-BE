import User from "../../models/userModel.js";
import Verification from "../../models/verificationModel.js";

import { ObjectId } from "mongodb";

//Verifications----------------------------------------
export const getVerifications = async (req, res) => {

  try{
    const verifications = await Verification.aggregate([
      {$match: {is_removed: false}},
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
                sex: 1,
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
        $lookup: {
          from: "verifications",
          localField: "_id",
          foreignField: "user_id",
          as: "verificationData",
        }
      },
      {
        $project: {
          createdAt: 1,
          email: 1,
          mobile_no: 1,
          address: 1,
          birthdate: 1,
          is_verified: 1,
          profile_pic: 1,
          verify_status: 1,
          sex: 1,
          verify_status: 1,
        },
      },
    ]);

    return res.status(200).json({ specific_verification });
  } catch (err) {
    console.log(err.message);
  }
};

export const acceptVerification = async (req, res) => {

  console.log(req.params);

  try {
    Verification.findOneAndUpdate(
      { user_id: req.params.id },
      { verify_status: "Accepted" },
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
    Verification.findOneAndUpdate(
      { user_id: req.params.id },
      { verify_status: "Rejected" },
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

export const removeSpecificVerification = async (req, res) => {

  try{
    Verification.findOneAndUpdate(
      { user_id: req.params.id },
      { is_removed: true },
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

const sortAscendingHelper = async (sortValue) => {

  const verifications = await Verification.aggregate([
    {$match: {is_removed: false}},
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
              sex: 1,
            },
          },
        ]
      },
    },
    {$sort: {[sortValue]: 1}},

  ]);

  return Promise.all(verifications);
}

export const sortVerification = async (req, res) => {

  const choice = req.body.choice;
  switch (choice) {
    case 'name':
      try{
      
        const verifications = await sortAscendingHelper('workerData.name');
  
        return res.status(200).json({ verifications });
    
      } catch( error ){
        console.log(error);
      }

      break;

    case 'date':
      try{
        const verifications = await sortAscendingHelper('workerData.createdAt');
  
        return res.status(200).json({ verifications });
      } catch(error){
        console.log(error);
      }

      break;

    default:
      break;
  }
};

const verificationFilterHelper = async (filterValue) => {

  const verifications = await Verification.aggregate([
    {$match: {verify_status: filterValue}},
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
              sex: 1,
            },
          }
        ]
      }
    }
  ]);

  return Promise.all(verifications);
}

export const filterVerification = async (req, res) => {

  const choice = req.body.choice;
  
  switch (choice) {
    case 'Pending':
      try{
      
        const verifications = await verificationFilterHelper('Pending');
        
        return res.status(200).json({ verifications });
    
      } catch( error ){
        console.log(error);
      }

      break;

    case 'Accepted':
      try{
        const verifications = await verificationFilterHelper('Accepted');
  
        return res.status(200).json({ verifications });
      } catch(error){
        console.log(error);
      }

      break;
    case 'Rejected':
      try{
        const verifications = await verificationFilterHelper('Rejected');
  
        return res.status(200).json({ verifications });
      } catch(error){
        console.log(error);
      }

      break;

    default:
      break;
  }
};