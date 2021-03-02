const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

// const Review = mongoose.model("Review", reviewSchema);
// connect multiple reviews with a campground (one to many relationship)

module.exports = mongoose.model("Review", reviewSchema);