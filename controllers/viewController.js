import Tour from "../models/tourModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render template using tour data
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

export const getTour = catchAsync(async (req, res) => {
  // 1) Get the tour
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  // 2) Render template
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});
