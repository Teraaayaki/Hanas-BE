import Feedback from "../../models/feedbackModel.js";
import Booking from "../../models/bookingModel.js";
import Favorites from "../../models/favoritesModel.js";

export const bookSkilledWorker = async (req, res) => {
  if (!req.body.DATA) {
    return res.status(403).send({ error: "Must input some data" });
  }
  let booking_details = await Booking.create({ ...req.body.DATA });

  let booking_data = await Booking.aggregate([
    { $match: { _id: booking_details._id } },
    {
      $lookup: {
        from: "users",
        localField: "worker",
        foreignField: "_id",
        as: "workerData",
        pipeline: [{ $project: { password: 0 } }],
      },
    },
    {
      $lookup: {
        from: "myservices",
        localField: "service_availed",
        foreignField: "_id",
        as: "workerServiceData",
        pipeline: [
          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "serviceNameData",
              pipeline: [{ $project: { service_type: 1 } }],
            },
          },
          { $project: { password: 0 } },
        ],
      },
    },
  ]);

  console.log(booking_data);

  return res.status(200).json({ booking_data: booking_data[0] });
};

export const getBookings = async (req, res) => {
  let bookings = await Booking.aggregate([
    { $match: { client: req.user._id } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "worker",
        foreignField: "_id",
        as: "workerData",
        pipeline: [{ $project: { password: 0 } }],
      },
    },
    {
      $lookup: {
        from: "myservices",
        localField: "service_availed",
        foreignField: "_id",
        as: "workerServiceData",
        pipeline: [
          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "serviceNameData",
              pipeline: [{ $project: { service_type: 1 } }],
            },
          },
          { $project: { password: 0 } },
        ],
      },
    },
  ]);
  return res.status(200).json({ bookings });
};

// not yet used
export const getFeedback = async (req, res) => {
  let client_id = req.user._id;

  let feedback = await Feedback.aggregate([
    { $match: { client: client_id } },
    {
      $lookup: {
        from: "users",
        localField: "worker",
        foreignField: "_id",
        as: "workerNameData",
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
                ],
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "myservices",
        localField: "my_service_id",
        foreignField: "_id",
        as: "myServicesData",
        pipeline: [
          {
            $lookup: {
              from: "services",
              localField: "service",
              foreignField: "_id",
              as: "ServiceNameData",
              pipeline: [{ $project: { service_type: 1 } }],
            },
          },
          {
            $project: {
              hourly_rate: 1,
              ServiceNameData: 1,
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({ feedback });
};

export const addToFavorites = async (req, res) => {
  if(!req.body){
    return res.status(403).send("Unable to add to Favorites");
  }

  console.log(req.body);

  let counterHolder = await Favorites.count({
    client_id: req.body.DATA.client_id,
    favorite_services: { $in: [req.body.DATA.favorite_services] },
  });

  if (counterHolder != 0) {
    return res.status(422).send({ error: "Worker already added" });
  }

  Favorites.findOneAndUpdate(
    { client_id: req.body.DATA.client_id },
    { $push: { favorite_services: req.body.DATA.favorite_services } },
    { upsert: true },
    (error, success) => {
      if (error) {
        console.log("Error", error);
      } else {
        console.log("Success", success);
      }
    }
  });

    return res.status(200).json("Added Worker to Favorites");
};

const aggregateFavourites = (favorite_services) => {
  const promise = favorite_services.map(async (my_service_id) => {
    let myService = await MyService.aggregate([
      {
        $match: {
          _id: my_service_id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "worker",
          foreignField: "_id",
          as: "clientNameData",
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
          ],
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceNameData",

          pipeline: [{ $project: { service_type: 1 } }],
        },
      },
      {
        $project: {
          hourly_rate: 1,
          serviceNameData: 1,
          clientNameData: 1,
        },
      },
    ]);
    return myService[0];
  });

  return Promise.all(promise);
};

export const getFavorites = async (req, res) => {
  try {
    let favorites = await Favorites.findOne({ client_id: req.user._id });
    console.log(favorites.favorite_services);
    let favoritesArray = await aggregateFavourites(favorites.favorite_services);

    return res.status(200).json({ favoritesArray });
  } catch (err) {
    console.log(err);

    return res.status(403).send({err});
  }
  
}