import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("user", "admin"),
    reviewController.getAllReviews
  )
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReviewById)
  .patch(reviewController.updateReview)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    reviewController.deleteReview
  );

export default router;
