import Tour from "./../models/tourModel.js";
import APIQueryBuilder from "./../utils/apiQueryBuilder.js";
import catchAsync from "./../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import * as factory from "./handlerFactory.js";

export const aliasTopTours = (request, response, next) => {
  request.query.limit = "5";
  request.query.sort = "-ratingsAverage,price";
  request.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

export const getAllTours = catchAsync(async (request, response, next) => {
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
});

export const getTourById = catchAsync(async (request, response, next) => {
  const tourById = await Tour.findById(request.params.id).populate("reviews");

  if (!tourById) {
    return next(new AppError("No tour found with that ID", 404));
  }

  response.status(200).json({
    status: "success",
    data: {
      tour: tourById,
    },
  });
});

export const createTour = factory.createOne(Tour);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);

export const getTourStats = catchAsync(async (request, response, next) => {
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
    result: stats.length,
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(async (request, response, next) => {
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
});
