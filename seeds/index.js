const mongoose = require("mongoose");

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

/* const seedDb = async () => {
  await Campground.deleteMany({});
  const c = new Campground({ title: "purple field"})
  await c.save();
}; */

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random30 = Math.floor(Math.random() * 30);
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      author: "602cd5b41e593017c4231e52",
      location: `${cities[random30].city}, ${cities[random30].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat fuga, porro deleniti eveniet eius ducimus fugiat? Inventore quis quos eum!",
      price,
      geometry: {
        type: 'Point', 
        coordinates: [
          cities[random30].longitude,
          cities[random30].latitude
        ] 
      },
      images: [
        {
          url:
            "https://res.cloudinary.com/dqty2etfr/image/upload/v1614877261/YelpCamp/vl4u6mharmmcnpjgmmzd.jpg",
          filename: "YelpCamp/vl4u6mharmmcnpjgmmzd",
        },
        {
          url:
            "https://res.cloudinary.com/dqty2etfr/image/upload/v1614877290/YelpCamp/tj0x5hk2sajf2wpx7tvj.jpg",
          filename: "YelpCamp/tj0x5hk2sajf2wpx7tvj",
        },
      ],
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
