import Services from "../../models/serviceModel.js";
import Feedback from "../../models/feedbackModel.js";
import MyService from "../../models/myServiceModel.js";
import User from "../../models/userModel.js";

export const getTopRatedWorkers = async(req, res) => {

    let top_rated_worker = await (await User.aggregate([
        {
            $lookup : {
                from: "myservices",       // other table name
                localField: "worker",   // primary key kung asa gikan na table
                foreignField: "user_id", // foreign key niya sa other table nga need i join
                as: "MyServicesData"         // nickname sa results
            },
        },
        {
            $lookup : {
                from: "services",
                localField: "service_id",
                foreignField: "service",
                as: "ServicesData"
            }
        },
        { "$match": { "is_worker": true} },
        { "$project" : { "password": 0 } },
        // { $unwind : "$MyServicesData"},
        
    ]));

    return res.status(200).json({user: top_rated_worker});
}