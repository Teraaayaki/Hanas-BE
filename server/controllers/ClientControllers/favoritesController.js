import Feedback from "../../models/feedbackModel.js";
import Booking from "../../models/bookingModel.js";
import Favorites from "../../models/favoritesModel.js";
import MyService from "../../models/myServiceModel.js";

export const addToFavorites = async (req, res) => {
  if (!req.body) {
    return res.status(403).send("Unable to add to Favorites");
  }

  let counterHolder = await Favorites.count({
    client_id: req.body.DATA.client_id,
    favorite_services: { $in: [req.body.DATA.favorite_services] },
  });
  console.log(counterHolder);
  //if counterHolder is not 0 meaning naa na ang kato na worker
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
  );

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
                profile_pic: 1,
                address: 1,
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
          _id: 1,
          hourly_rate: 1,
          serviceNameData: 1,
          clientNameData: 1,
        },
      },
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "my_service_id",
          as: "feedbacksAveragedData",
          pipeline: [
            {
              $group: {
                _id: null,
                rating: { $avg: "$rate" },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "service_availed",
          as: "bookingsAveragedData",
          pipeline: [
            {
              $match: {
                book_status: "Finished",
              },
            },
            {
              $count: "jobs",
            },
          ],
        },
      },
      {
        $addFields: {
          feedbacksAveragedData: {
            $arrayElemAt: ["$feedbacksAveragedData", 0],
          },
          bookingsAveragedData: {
            $arrayElemAt: ["$bookingsAveragedData", 0],
          },
        },
      },
    ]);
    return myService[0];
  });

  return Promise.all(promise);
};

export const getFavorites = async (req, res) => {
  let favoritesArray = [];
  try {
    let favorites = await Favorites.findOne({ client_id: req.user._id });

    if (favorites) {
      favoritesArray = await aggregateFavourites(favorites.favorite_services);
    } else if (favorites === null) {
      return res.status(200).json({ favoritesArray: [] });
    }

    if (favoritesArray) {
      return res.status(200).json({ favoritesArray });
    } else {
      return res.status(200).json({ favoritesArray: [] });
    }
  } catch (err) {
    console.log(err);

    return res.status(403).send({ err });
  }
};

export const removeFromFavorites = async (req, res) => {
  if (!req.body) {
    return res.status(403).send("Unable to remove from favorites");
  }

  try {
    Favorites.findOneAndUpdate(
      { client_id: req.body.DATA.client_id },
      { $pull: { favorite_services: req.body.DATA.favorite_services } },
      (error, success) => {
        if (error) {
          console.log("Error", error);
        } else {
          console.log("Success", success);
        }
      }
    );
    return res.status(200).json({ message: "Successful deletion" });
  } catch (err) {
    console.log(err);
    return res.status(403).send({ err });
  }
};
