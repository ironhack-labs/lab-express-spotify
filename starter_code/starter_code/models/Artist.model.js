
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const artistSchema = new Schema({
  title: String,
  description: String,
  author: String,
  rating: Number
}, { timestamps: true })

const Artist = mongoose.model("Artist", artistSchema)

module.exports = Artist