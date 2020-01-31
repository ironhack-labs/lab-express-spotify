const spotify = require('../config/spotify.config')

exports.searchArtistView = (req, res) => {
    res.render('artist-search-results')
}



exports.searchArtist = (req, res) => {
    const {name} = req.body
    console.log(name)
  spotify.searchArtists(name)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items)
    res.render('artist-search-results', {data})//PUSIMOS LLAVES, CHECAR DESPUES ////////////
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    
  
})
.catch(err => console.log('The error while searching artists occurred: ', err));
}




exports.searchAlbumsView = (req, res) => {
    const {artistId} = req.params
    console.log("artistsId:", artistId)
  spotify.getArtistAlbums(artistId)
  .then(album => {
    console.log('The received data from the API: ', album)
    let {items} = album.body
    res.render('albums', {items})
    
  
})
.catch(err => console.log('The error while searching artists occurred: ', err));
}


exports.searchTracksView = (req, res) => {
    const {albumId} = req.params
    console.log("albumId:", albumId)
  spotify.getAlbumTracks(albumId)
  .then(tracks => {
    console.log('The received data from the API: ', tracks)
    let {items} = tracks.body
    res.render('tracks', {items})
    
  
})
.catch(err => console.log('The error while searching artists occurred: ', err));
}