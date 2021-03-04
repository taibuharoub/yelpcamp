const express = require("express");
const router = express.Router();

const multer = require("multer");
const {storage} = require("../cloudinary")
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundControllers = require("../controllers/campgrounds");

router
  .route("/")
  .get(catchAsync(campgroundControllers.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundControllers.createCampground)
  )
  

router.get("/new", isLoggedIn, campgroundControllers.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgroundControllers.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
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
