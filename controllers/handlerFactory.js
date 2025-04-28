import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

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
