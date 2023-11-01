const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://mongo:Bu7");
    console.log("Connected toblog Database ");
  } catch (error) {
    console.log(error);
    throw new Error("Couldn't connect to the database");
  }
};

module.exports = {
  connection,
};
