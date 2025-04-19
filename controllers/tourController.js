import Tour from "./../models/tourModel.js";
import APIQueryBuilder from "./../utils/apiQueryBuilder.js";

export const aliasTopTours = (request, response, next) => {
  request.query.limit = "5";
  request.query.sort = "-ratingsAverage,price";
  request.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

export const getAllTours = async (request, response) => {
  try {
    // Build query
    const queryBuilder = new APIQueryBuilder(Tour.find(), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const allTours = await queryBuilder.mongooseQuery;

    response.status(200).json({
      status: "success",
      results: allTours.length,
      data: {
        tours: allTours,
      },
    });
  } catch (err) {
    response.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getTourById = async (request, response) => {
  try {
    const tourById = await Tour.findById(request.params.id);

    response.status(200).json({
      status: "success",
      data: {
        tour: tourById,
      },
    });
  } catch (err) {
    response.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
};

export const createTour = async (request, response) => {
  try {
    const newTour = await Tour.create(request.body);

    response.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    response.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const updateTour = async (request, response) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    response.status(200).json({
      status: "success",
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    response.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const deleteTour = async (request, response) => {
  try {
    const tourToDelete = await Tour.findByIdAndDelete(request.params.id);

    if (!tourToDelete) {
      return response.status(404).json({
        status: "fail",
        message: "No tour found with that ID",
      });
    }

    response.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    response.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
};

export const getTourStats = async (request, response) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { numRatings: 1 },
      },
    ]);

    response.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    response.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getMonthlyPlan = async (request, response) => {
  try {
    const year = request.params.year * 1; // Convert string to number
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: {
          month: "$_id",
          monthName: {
            $arrayElemAt: [
              [
                "",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              "$_id",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);

    response.status(200).json({
      status: "success",
      result: plan.length,
      data: {
        plan,
      },
    });
  } catch (err) {
    response.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
