require("dotenv").config();
const mongoose = require("mongoose");
const Artist = require("../models/Artist");

mongoose.connect(process.env.DB)

// .then(() => {
//   console.log("connect to mongoose");
// })
// .then(() => {
//   return Book.insertMany([
//     {
//       title: "El mundo de Pepe",
//       author:"Gabi",
//       text: "Una vida amorosa loca entre Pepe y Gabo"
//     },
//     {
//       title: "La boda de Albert",
//       author: "Isa",
//       text: "Todo empezo en un baño"
//     }
//   ])
// })
// .then(books => {
//   console.log(books);
//   mongoose.connection.close();
// })