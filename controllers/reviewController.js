import catchAsync from "../utils/catchAsync.js";
import Review from "./../models/reviewModel.js";

export const getAllReviews = catchAsync(async function (req, res, next) {
  const allReviews = await Review.find();

  res.status(200).json({
    status: "success",
    result: allReviews.length,
    data: {
      reviews: allReviews,
    },
  });
});

export const createReview = catchAsync(async function (req, res, next) {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});
