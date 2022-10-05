import Report from "../../models/reportModel.js";

import { ObjectId } from "mongodb";

export const getReportList = async (req, res) => {
  const reportList = await Report.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "reporter",
        foreignField: "_id",
        as: "reporterData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
              is_worker: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reported_user",
        foreignField: "_id",
        as: "reportedUserData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
              is_worker: 1,
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({ reportList });
};

export const getReporterReportsList = async (req, res) => {
  try {
    const reporterReportsList = await Report.aggregate([
      {
        $match: {
          reporter: new ObjectId(req.params.id),
        },
      },
      {
        $project: {
          attached_images: 0,
          message: 0,
          __v: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({ reporterReportsList });
  } catch (err) {
    console.log(err.message);
  }
};

export const getReport = async (req, res) => {
  try {
    const reports = await Report.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id),
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reporter",
          foreignField: "_id",
          as: "reporterData",
          pipeline: [
            {
              $project: {
                profile_pic: 1,
                first_name: 1,
                middle_name: 1,
                family_name: 1,
                suffix: 1,
                is_worker: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reported_user",
          foreignField: "_id",
          as: "reportedUserData",
          pipeline: [
            {
              $project: {
                profile_pic: 1,
                first_name: 1,
                middle_name: 1,
                family_name: 1,
                suffix: 1,
                is_worker: 1,
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({ reports });
  } catch (err) {
    console.log(err.message);
  }
};

export const resolveReport = async (req, res) => {
  try {
    Report.findOneAndUpdate(
      { _id: req.params.id },
      { status: "Resolved" },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};

export const rejectReport = async (req, res) => {
  try {
    Report.findOneAndUpdate(
      { _id: req.params.id },
      { status: "Rejected" },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};

export const reopenReport = async (req, res) => {
  try {
    Report.findOneAndUpdate(
      { _id: req.params.id },
      { status: "Pending" },
      (error, updatedRecord) => {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).json({ updatedRecord });
        }
      }
    ).select({ __v: 0 });
  } catch (err) {
    console.log(err.message);
  }
};

const sortAscendingHelper = async (sortValue) => {
  const reportList = await Report.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "reporter",
        foreignField: "_id",
        as: "reporterData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reported_user",
        foreignField: "_id",
        as: "reportedUserData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
            },
          },
        ],
      },
    },
    { $sort: { [sortValue]: 1 } },
  ]);

  return Promise.all(reportList);
};

const reportDefault = async () => {
  const reportList = await Report.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "reporter",
        foreignField: "_id",
        as: "reporterData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reported_user",
        foreignField: "_id",
        as: "reportedUserData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
            },
          },
        ],
      },
    },
  ]);

  return Promise.all(reportList);
};

const reporterReportsDefault = async (id) => {
  const reporterReportsList = await Report.aggregate([
    {
      $match: {
        reporter: new ObjectId(id),
        status: { $in: ["Resolved", "Pending", "Rejected"] },
      },
    },
    {
      $project: {
        attached_images: 0,
        message: 0,
        __v: 0,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return Promise.all(reporterReportsList);
};

export const sortReport = async (req, res) => {
  const choice = req.body.choice;
  switch (choice) {
    case "all":
      try {
        const reportList = await reportDefault();

        return res.status(200).json({ reportList });
      } catch (error) {
        console.log(error);
      }

      break;

    case "name":
      try {
        const reportList = await sortAscendingHelper("reporterData.first_name");

        return res.status(200).json({ reportList });
      } catch (error) {
        console.log(error);
      }

      break;

    case "date":
      try {
        const reportList = await sortAscendingHelper("createdAt");

        return res.status(200).json({ reportList });
      } catch (error) {
        console.log(error);
      }

      break;

    default:
      break;
  }
};

const sortReporterReportsAscendingHelper = async (sortValue, id) => {
  const reporterReportsList = await Report.aggregate([
    {
      $match: {
        reporter: new ObjectId(id),
      },
    },
    {
      $project: {
        attached_images: 0,
        message: 0,
        __v: 0,
      },
    },
    { $sort: { [sortValue]: 1 } },
  ]);

  return Promise.all(reporterReportsList);
};

const sortReporterReportsDescendingHelper = async (sortValue, id) => {
  const reporterReportsList = await Report.aggregate([
    {
      $match: {
        reporter: new ObjectId(id),
      },
    },
    {
      $project: {
        attached_images: 0,
        message: 0,
        __v: 0,
      },
    },
    { $sort: { [sortValue]: -1 } },
  ]);

  return Promise.all(reporterReportsList);
};

export const sortReporterReports = async (req, res) => {
  const choice = req.body.choice;
  const clientID = req.body.clientID;
  switch (choice) {
    case "createdAt":
      try {
        const reporterReportsList = await reporterReportsDefault(clientID);

        return res.status(200).json({ reporterReportsList });
      } catch (error) {
        console.log(error);
      }

      break;
    case "updatedAt":
      try {
        const reporterReportsList = await sortReporterReportsDescendingHelper(
          choice,
          clientID
        );

        return res.status(200).json({ reporterReportsList });
      } catch (error) {
        console.log(error);
      }

      break;
    default:
      try {
        const reporterReportsList = await sortReporterReportsAscendingHelper(
          choice,
          clientID
        );

        return res.status(200).json({ reporterReportsList });
      } catch (error) {
        console.log(error);
      }
      break;
  }
};

const reportFilterHelper = async (filterValue) => {
  const reportList = await Report.aggregate([
    { $match: { status: filterValue } },
    {
      $lookup: {
        from: "users",
        localField: "reporter",
        foreignField: "_id",
        as: "reporterData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reported_user",
        foreignField: "_id",
        as: "reportedUserData",
        pipeline: [
          {
            $project: {
              profile_pic: 1,
              first_name: 1,
              middle_name: 1,
              family_name: 1,
              suffix: 1,
            },
          },
        ],
      },
    },
  ]);

  return Promise.all(reportList);
};

export const filterReport = async (req, res) => {
  const choice = req.body.choice;
  switch (choice) {
    case "all":
      try {
        const reportList = await reportDefault(req.params.id);

        return res.status(200).json({ reportList });
      } catch (error) {
        console.log(error);
      }

      break;

    case "resolved":
      try {
        const reportList = await reportFilterHelper("Resolved");

        return res.status(200).json({ reportList });
      } catch (error) {
        console.log(error);
      }

      break;

    case "pending":
      try {
        const reportList = await reportFilterHelper("Pending");

        return res.status(200).json({ reportList });
      } catch (error) {
        console.log(error);
      }

      break;
    case "rejected":
      try {
        const reportList = await reportFilterHelper("Rejected");

        return res.status(200).json({ reportList });
      } catch (error) {
        console.log(error);
      }

      break;

    default:
      break;
  }
};

const reporterReportsFilterHelper = async (filterValue, id) => {
  const reporterReportsList = await Report.aggregate([
    {
      $match: {
        reporter: new ObjectId(id),
        status: filterValue,
      },
    },
    {
      $project: {
        attached_images: 0,
        message: 0,
        __v: 0,
      },
    },
  ]);
  return Promise.all(reporterReportsList);
};

export const filterReporterReports = async (req, res) => {
  const choice = req.body.choice;
  const clientID = req.body.clientID;
  switch (choice) {
    case "All":
      try {
        const reporterReportsList = await reporterReportsDefault(clientID);

        return res.status(200).json({ reporterReportsList });
      } catch (error) {
        console.log(error);
      }
      break;
    default:
      try {
        const reporterReportsList = await reporterReportsFilterHelper(
          choice,
          clientID
        );

        return res.status(200).json({ reporterReportsList });
      } catch (error) {
        console.log(error);
      }
      break;
  }
};
