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

exports.getArtistAlbumsView = (req, res) => {
    const {artistId} = req.params
    console.log("artistId:", artistId)

    spotify
    .getArtistAlbums(artistId)
    .then( album => {console.log(`The received data from the API:`, album)
    let {items} = album.body
    res.render('albums', {items})


})
.catch( err => console.log('The error while searching artist ocuured:',err))
}


exports.getTracks = (req, res) => {
    const {tracksId} = req.params
    console.log("tracksId:", tracksId)

    spotify
    .getAlbumTracks(tracksId)
    .then( track => {console.log(`The received data from the API:`, track)
    let {items} = track.body
    res.render('tracks', {items})
    

})
.catch( err => console.log('The error while searching artist ocuured:',err))
}








