const express = require("express");
const router = express.Router();

const ArticleController = require("../controls/article_control");

//Rutes tests
router.get("/test-rute", ArticleController.test);
router.get("/curse", ArticleController.curse);

//useful rute
router.post("/create", ArticleController.create);

//get rute
router.get("/articles", ArticleController.list);

module.exports = router;
