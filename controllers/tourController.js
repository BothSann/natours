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
      message: "Invalid data sent",
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
      message: "Invalid data sent",
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
