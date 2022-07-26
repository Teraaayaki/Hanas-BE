import ConvFeeTransaction from "../../models/convFeeTransactionModel.js";

import { ObjectId } from "mongodb";
import { getApi } from "ngrok";

export const getConvFeeTransactions = async (req, res) => {
    const convFeeTransactions =  await ConvFeeTransaction.aggregate([
        {
            $lookup: {
                from: 'users', 
                localField: 'worker', 
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
                    },
                },
                ]
            },
        },
        {
            $project: {
                total_paid: 1,
                total_amount: 1,
                payments: 1,
                updatedAt: 1,
                worker: 1,
                "workerData.name": 1,
            }
        },
    ]);

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

const convFeeDefault = async (req, res) => {
    const convFeeTransactions =  await ConvFeeTransaction.aggregate([
        {
            $lookup: {
                from: 'users', 
                localField: 'worker', 
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
                    },
                },
                ]
            },
        },
        {
            $project: {
                total_paid: 1,
                total_amount: 1,
                payments: 1,
                updatedAt: 1,
                worker: 1,
                "workerData.name": 1,
            }
        },
    ]);

    return Promise.all(convFeeTransactions);
};

const sortAscendingHelper = async (sortValue) => {

    const convFeeTransactions =  await ConvFeeTransaction.aggregate([
        {
            $lookup: {
                from: 'users', 
                localField: 'worker', 
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
                    },
                },
                ]
            },
        },
        {
            $project: {
                total_paid: 1,
                total_amount: 1,
                payments: 1,
                updatedAt: 1,
                worker: 1,
                "workerData.name": 1,
            }
        },
        {$sort: {[sortValue]: 1}},
    ]);

    return Promise.all(convFeeTransactions);

};

export const sortConvFee = async (req, res) => {

    const choice = req.body.choice;
    switch (choice) {
      case 'all':
        try{
        
          const convFeeTransactions = await convFeeDefault();
    
          return res.status(200).json({ convFeeTransactions });
      
        } catch( error ){
          console.log(error);
        }
  
        break;
      case 'name':
        try{
        
          const convFeeTransactions = await sortAscendingHelper('workerData.name');
    
          return res.status(200).json({ convFeeTransactions });
      
        } catch( error ){
          console.log(error);
        }
  
        break;
  
      case 'date':
        try{
          const convFeeTransactions = await sortAscendingHelper('updatedAt');
    
          return res.status(200).json({ convFeeTransactions });
        } catch(error){
          console.log(error);
        }
  
        break;
    
      default:
        break;
    }
};

const filterConvFeeHelper = async (filterValue) => {
    const convFeeTransactions =  await ConvFeeTransaction.aggregate([
        filterValue,
        {
            $lookup: {
                from: 'users', 
                localField: 'worker', 
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
                    },
                },
                ]
            },
        },
        {
            $project: {
                total_paid: 1,
                total_amount: 1,
                payments: 1,
                updatedAt: 1,
                worker: 1,
                "workerData.name": 1,
            }
        },
    ]);

    return Promise.all(convFeeTransactions);
};

export const filterConvFee = async (req, res) => {

    const choice = req.body.choice;
    switch (choice) {
      case 'all':
        try{
        
          const convFeeTransactions = await convFeeDefault();
    
          return res.status(200).json({ convFeeTransactions });
      
        } catch( error ){
          console.log(error);
        }
  
        break;

      case 'pending':
        try{
        
          const convFeeTransactions = await filterConvFeeHelper({ $match: { total_amount: { $gt : 0 } } });
    
          return res.status(200).json({ convFeeTransactions });
      
        } catch( error ){
          console.log(error);
        }
  
        break;
  
      case 'paid':
        try{
          const convFeeTransactions = await filterConvFeeHelper({ $match: { total_amount: { $eq : 0 } } });
    
          return res.status(200).json({ convFeeTransactions });
        } catch(error){
          console.log(error);
        }
  
        break;
    
      default:
        break;
    }
};

