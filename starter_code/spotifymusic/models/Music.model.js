const mongoose = require('mongoose')
const Schema = mongoose.Schema

const musicSchema = new Schema(
  {
    title: String,
    description: String,
    author: String,
    rating: Number
  },
  { timestamps: true }
)

const Artista = mongoose.model('artista', musicSchema)

module.exports = Artista
