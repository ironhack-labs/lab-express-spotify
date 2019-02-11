let mongoose = require ('mongoose')
let Schema = mongoose.Schema

let artistSchema = new Schema({
    name: String
})


module.exports = mongoose.model ('Spotify', artistSchema)