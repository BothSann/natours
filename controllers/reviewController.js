import catchAsync from "../utils/catchAsync.js";
import Review from "./../models/reviewModel.js";
import * as factory from "./handlerFactory.js";

export const getAllReviews = catchAsync(async function (req, res, next) {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const allReviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    result: allReviews.length,
    data: {
      reviews: allReviews,
    },
  });
});

export const setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const createReview = factory.createOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
