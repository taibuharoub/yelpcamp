const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundControllers = require("../controllers/campgrounds");

router
  .route("/")
  .get(catchAsync(campgroundControllers.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgroundControllers.createCampground)
  );

router.get("/new", isLoggedIn, campgroundControllers.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgroundControllers.showCampground))
  .put(
    isLoggedIn,
    validateCampground,
    isAuthor,
    catchAsync(campgroundControllers.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundControllers.deleteCampground)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundControllers.renderEditForm)
);

module.exports = router;
