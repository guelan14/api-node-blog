const fs = require("fs");
const validator = require("validator");
const Article = require("../models/Article");
const path = require("path");

const test = (req, res) => {
  return res.status(200).json({
    message: "soy una accion de preuba en mi controlador de articulos",
  });
};

const curse = (req, res) => {
  return res.status(200).json({ curso: "Api restful", autor: "Ni idea" });
};

const create = (req, res) => {
  //save parametters with post to save
  let parametters = req.body;

  //verify
  try {
    let title_verification =
      !validator.isEmpty(parametters.title) &&
      validator.isLength(parametters.title, { min: 5, max: 100 });
    let content_verification = !validator.isEmpty(parametters.content);

    if (!title_verification || !content_verification) {
      throw new Error("Verification didnt pass");
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", massage: "faltan datos por enviar" });
  }

  //create object
  const article = new Article(parametters);

  //assign objects (manual o automatic)

  //save article in db
  article
    .save()
    .then((articleSave) => {
      return res.status(200).json({
        status: "Success",
        article: articleSave,
        message: "Article Save !",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el articulo: " + error.message,
      });
    });
};

const list = async (req, res) => {
  try {
    let articles;

    if (req.params.last) {
      articles = await Article.find({}).limit(3).sort({ date: -1 }).exec();
    } else {
      articles = await Article.find({}).sort({ date: -1 }).exec();
    }

    return res.status(200).send({
      status: "Success",
      parametter: req.params.last,
      count: articles.length,
      articles,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje: "Error, Aritcles didnt find",
    });
  }
};

const one = async (req, res) => {
  try {
    // Obtener el ID de la URL
    let id = req.params.id;

    const article = await Article.findById(id);

    return res.status(200).json({
      status: "success",
      article,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error searching for the article: " + error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    let id = req.params.id;

    const article = await Article.findOneAndDelete({ _id: id });
    return res.status(200).json({
      status: "Remove Item Succes",
      massage: "Delete Method",
      article,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error searching for the article: " + error.message,
    });
  }
};

const edit = async (req, res) => {
  try {
    let id = req.params.id;
    //get body elements
    let parametters = req.body;
    //validate
    try {
      let title_verification =
        !validator.isEmpty(parametters.title) &&
        validator.isLength(parametters.title, { min: 5, max: 100 });
      let content_verification = !validator.isEmpty(parametters.content);

      if (!title_verification || !content_verification) {
        throw new Error("Verification didnt pass");
      }
    } catch (error) {
      return res
        .status(400)
        .json({ status: "error", massage: "faltan datos por enviar" });
    }
    //Find and update
    let updateArticle = await Article.findOneAndUpdate(
      { _id: id },
      parametters,
      { new: true }
    );
    if (!updateArticle) {
      return res.status(500).json({
        status: "error",
        mensaje: "Update Error",
      });
    }
    return res.status(200).json({
      status: "success updated",
      mensaje: "Se ha actualizado correctamente",
      articulo: updateArticle,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error searching for the article: " + error.message,
    });
  }
};

const upload = async (req, res) => {
  //multer config

  //Get files from image
  if (!req.file && !req.files) {
    return res
      .status(404)
      .json({ status: "error", massage: "Invalid Petition" });
  }

  //get name file
  let file = req.file.originalname;

  //gete extension
  let file_split = file.split(".");
  let extension = file_split[1];

  //compere correct extension
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    //Borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      return res
        .status(404)
        .json({ status: "error", massage: "invalid Image" });
    });
  } else {
    try {
      let id = req.params.id;

      //Find and update
      let updateArticle = await Article.findOneAndUpdate(
        { _id: id },
        { image: req.file.filename },
        { new: true }
      );
      if (!updateArticle) {
        return res.status(500).json({
          status: "error",
          mensaje: "Update Error",
        });
      }
      return res.status(200).json({
        status: "success updated",
        mensaje: "Se ha actualizado correctamente",
        articulo: updateArticle,
        fichero: req.file,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error searching for the article: " + error.message,
      });
    }
  }
};

const image = (req, res) => {
  let file = req.params.file;
  let rute = "./images/articles/" + file;

  fs.stat(rute, (error, exist) => {
    if (exist) {
      return res.sendFile(path.resolve(rute));
    } else {
      return res.status(404).json({
        status: "error ",
        masage: "image doesnt exist",
        exist,
        file,
        rute,
      });
    }
  });
};

const search = async (req, res) => {
  //take string
  let search = req.params.search;
  //find or
  try {
    let article = await Article.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    })
      .sort({ date: -1 })
      .exec();

    if (!article || article.length <= 0) {
      return res.status(404).json({
        status: "error",
        message: "Error searching, couldnt find any",
      });
    }

    return res.status(200).json({
      status: "succes",
      article,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error searching " + error.message,
    });
  }

  //order
};

module.exports = {
  test,
  curse,
  create,
  list,
  one,
  remove,
  edit,
  upload,
  image,
  search,
};
