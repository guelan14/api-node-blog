const validator = require("validator");
const Article = require("../models/Article");

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
      throw new error("Verification didnt pass");
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
        status: "Succes",
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
    const articles = await Article.find({}).exec();
    return res.status(200).send({
      status: "Success",
      articles,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje: "No se ha guardado el artículo",
    });
  }
};

module.exports = { test, curse, create, list };
