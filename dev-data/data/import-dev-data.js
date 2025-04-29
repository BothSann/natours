import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import Tour from "./../../models/tourModel.js";
import User from "./../../models/userModel.js";
import Review from "./../../models/reviewModel.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "./config.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// Import data into DB

const importData = async () => {};
try {
  await Tour.create(tours);
  await User.create(users, { validateBeforeSave: false });
  await Review.create(reviews);
  console.log("Data successfully loaded!");
  process.exit();
} catch (err) {
  console.log(err);
}

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
