const express = require("express");
const router = express.Router();
const multer = require("multer");
const ArticleController = require("../controls/article_control");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/articles");
  },
  filename: function (req, file, cb) {
    cb(null, "article" + Date.now() + file.originalname);
  },
});

const uploads = multer({ storage: storage });

//Rutes tests
router.get("/test-rute", ArticleController.test);
router.get("/curse", ArticleController.curse);

//useful rute
router.post("/create", ArticleController.create);
router.get("/articles/:last?", ArticleController.list);
router.get("/article/:id", ArticleController.one);
router.delete("/article/:id", ArticleController.remove);
router.put("/article/:id", ArticleController.edit);
router.post(
  "/upload-image/:id",
  [uploads.single("file0")],
  ArticleController.upload
);
router.get("/image/:file", ArticleController.image);
router.get("/search/:search", ArticleController.search);

module.exports = router;
