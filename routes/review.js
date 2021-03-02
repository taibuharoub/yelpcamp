const express = require("express");

const router = express.Router({ mergeParams: true });

const { reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewsControllers = require("../controllers/reviews");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewsControllers.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewsControllers.deleteReview)
);

module.exports = router;
