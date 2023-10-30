const { Schema, model } = require("mongoose");

const ArticleSchema = Schema({
  title: { type: String, require: true },
  content: String,
  date: { type: String, default: Date.now },
  image: { type: String, default: "default.png" },
});

module.exports = model("Article", ArticleSchema, "articles");
