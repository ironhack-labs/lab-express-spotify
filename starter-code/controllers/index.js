const spotify = require('../config/spotify.config')

exports.searchArtist =  (req, res) => {
const {input} =  req.body
console.log(input)

spotify
.searchArtists(input)
.then( data => {console.log(`The received data from the API:`, data.body.items)
res.render('artist-search-results', {data})
})
.catch( err => console.log('The error while searching artist ocuured:',err))

// await res()

}








