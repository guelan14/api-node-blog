const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/my_blog");
    console.log("Connected toblog Database ");
  } catch (error) {
    console.log(error);
    throw new Error("Couldn't connect to the database");
  }
};

module.exports = {
  connection,
};
