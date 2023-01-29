// desde el controlador, importo la configuracion de 
// la libreria de espotify
const spotifyApi = require('../config/spotify.config')


module.exports.home = (req, res) => {
    res.render('home')
}

// GET /artist-search?search=shakira
module.exports.search = (req, res) => {
    // res.send('hola) primero
    spotifyApi
  .searchArtists(req.query.search)/*'HERE GOES THE QUERY ARTIST'*/
  .then((data) => {
    //'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('search', { artists: data.body.artists.items })
})
  .catch((err) => console.log('The error while searching artists occurred: ', err));
}

module.exports.albums = (req, res) => {
    // res.send('hola) primero
    spotifyApi
  .getArtistAlbums(req.params.id) //:id del router
  .then((data) => {
    res.render('albums', { albums: data.body.items })
})
  .catch((err) => console.log('The error while searching albums occurred: ', err));
}


module.exports.tracks = (req, res) => {
    //res.send(req.params);
    spotifyApi
  .getAlbumTracks(req.params.albumId) 
  .then((data) => {
    res.render('tracks', { tracks: data.body.items })
})
  .catch((err) => console.log('The error while searching tracks occurred: ', err));
}