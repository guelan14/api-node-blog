const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("m");
    console.log("Connected toblog Database ");
  } catch (error) {
    console.log(error);
    throw new Error("Couldn't connect to the database");
  }
};

module.exports = {
  connection,
};
