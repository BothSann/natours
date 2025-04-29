import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import APIQueryBuilder from "./../utils/apiQueryBuilder.js";

export const createOne = (Model) =>
  catchAsync(async (request, response, next) => {
    const newDoc = await Model.create(request.body);

    response.status(201).json({
      status: "success",
      data: {
        data: newDoc,
      },
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (request, response, next) => {
    const doc = await Model.findByIdAndDelete(request.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    response.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (request, response, next) => {
    const updateDoc = await Model.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateDoc) {
      return next(new AppError("No doc found with that ID", 404));
    }

    response.status(200).json({
      status: "success",
      data: {
        data: updateDoc,
      },
    });
  });

export const getOne = (Model, populateOptions) =>
  catchAsync(async (request, response, next) => {
    let query = Model.findById(request.params.id);
    if (populateOptions) query.populate(populateOptions);
    const docById = await query;

    if (!docById) {
      return next(new AppError("No doc found with that ID", 404));
    }

    response.status(200).json({
      status: "success",
      data: {
        data: docById,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET review on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Build query
    const queryBuilder = new APIQueryBuilder(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const allDocs = await queryBuilder.mongooseQuery;

    res.status(200).json({
      status: "success",
      results: allDocs.length,
      data: {
        data: allDocs,
      },
    });
  });
