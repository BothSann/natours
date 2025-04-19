import Tour from "./../models/tourModel.js";

export const getAllTours = async (request, response) => {
  try {
    const allTours = await Tour.find();

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
      message: "Error fetching tours",
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
