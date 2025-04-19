import Tour from "./../models/tourModel.js";

export const aliasTopTours = (request, response, next) => {
  request.query.limit = "5";
  request.query.sort = "-ratingsAverage,price";
  request.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

export const getAllTours = async (request, response) => {
  try {
    // Build Query
    /// 1) Filtering
    const queryObj = { ...request.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);

    // 2) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    if (request.query.sort) {
      const sortBy = request.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 3) Field Limiting
    if (request.query.fields) {
      const fields = request.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4) Pagination
    const page = request.query.page * 1 || 1;
    const limit = request.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (request.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist");
    }

    // const query = Tour.find(queryObj);

    // Execute Query
    const allTours = await query;

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
