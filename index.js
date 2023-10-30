const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
console.log("Starting Api");

//connection to db
connection();

const app = express();
const puerto = 3900;

//cors configuration
app.use(cors()); //ejecutamos cors antes de la ruta
app.use(express.json()); //recive content-tye data
app.use(express.urlencoded({ extended: true })); //recive url conded data

//RUTAS
const article_rutes = require("./rutes/article_rute");

//rutes load
app.use("/api", article_rutes);

//Rutes tests Hardcore
app.get("/probando", (req, res) => {
  console.log("Se ha ejecutado el endpoint ");
  return res.status(200).json({ curso: "Api restful", autor: "Ni idea" });
});

app.get("/", (req, res) => {
  return res.status(200).send("<h1>Empezando a crear api</h1>");
});

app.listen(puerto, () => {
  console.log("servidor corriendo en " + puerto);
});
