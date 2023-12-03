const spotifyApi = require('../config/spotify.config');

module.exports.renderIndex = (req, res, next) => {
    res.render("index")
}

module.exports.getArtistSearch = (req, res, next) => {
    const { artist } = req.query;
    if (!artist){
        res.redirect('/');
    }
    spotifyApi
.searchArtists(artist)
.then(data => {
  console.log('The received data from the API: ', data.body);
  res.render("artists/artist-search-results", { artists: data.body.artists.items })
})
.catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.getAlbums = (req, res, next) => {
    const { artistId } = req.params;
  
    spotifyApi.getArtistAlbums(artistId)
      .then(data => {
        res.render('albums/albums', { albums: data.body.items });
      })
      .catch(err => console.log('The error while searching artist albums occurred: ', err))
  
  }
  
  module.exports.getAlbumTracks = (req, res, next) => {
    const { albumId } = req.params;
  
    spotifyApi.getAlbumTracks(albumId)
      .then(data => {
        console.log(data.body.items);
        res.render('albums/album-tracks', { tracks: data.body.items });
      })
      .catch(err => console.log('The error while searching artist albums occurred: ', err))
  }