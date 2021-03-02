if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log(process.env.SECERT)

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const ejsaMate = require("ejs-mate");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");
const campgroundsRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/review");
const User = require("./models/user");
const userRoutes = require("./routes/users");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
const port = 3000;

const sessionConfig = {
  secret: "lazydog",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 24 *7,
    maxAge: 1000 * 60 * 24 *7
  }
}

app.engine("ejs", ejsaMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride("_method"));
app.use(session(sessionConfig));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})

app.use(userRoutes);

app.get("/", (req, res, next) => {
  res.render("home");
});


app.use("/campgrounds", campgroundsRoutes);

app.use("/campgrounds/:id/reviews", reviewRoutes);


app.all("*", (req, res, next) => {
  // res.send("404!!!");
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  // res.status(statusCode).send(message)
  res.status(statusCode).render("error", { err });
  // res.send("Something Went Wrong!")
});

app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});
