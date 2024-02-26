const spotifyApi = require('../config/spotify.config');


module.exports.home = (req, res, next)  => {
    res.render('home')
}

module.exports.list = (req, res, next) => {
    
    spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    const selectedItems = data.body.artists.items;
    res.render('list', {selectedItems})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.showAlbums = (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {
    const albumsArr = data.body.items;
    res.render('albums', {albumsArr});
  }, function(err) {
    console.error(err);
  });
  
}

module.exports.showTracks = (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.id)
  .then(function(data) {
      const albumName = 0 ;
      console.log(data)
      const tracksArr = data.body.items;
      tracksArr.forEach(track => {
        const totalSeconds = Math.floor(track.duration_ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        track.durationFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      });
      res.render('tracks', {tracksArr});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}