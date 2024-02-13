const spotifyApi = require('../configs/spotify.config');


module.exports.searchArtist = (req, res, next) => {
  const { artist } = req.query;

  if (!artist) {
    res.redirect('/');
  }

  spotifyApi.searchArtists(artist)
    .then((data) => {
      //console.log('The received data from the API: ', data.body);
      //console.log('La info empieza aquí: ', data.body.artists.items[0]);
      res.render('artistSearch/artistSearchResults', {artists: data.body.artists.items})
    })
    .catch((error) => console.log('The error while searching artists occurred: ', error));
}


module.exports.albums = (req, res, next) => {
  // console.log(req.params); //esto es solo un objeto con el ID
  const { id } = req.params;
  //console.log(id);
  
  spotifyApi.getArtistAlbums(id)
    .then((data) => {
      //console.log(data.body.items[0]);
      //console.log(data)
      res.render('albums/albums', {albums: data.body.items, artistName: data.body.items[0].artists[0].name})
    })
    .catch((error) => console.log('The error while searching artists albums ocurred: ', error))
}

module.exports.tracks = (req, res, next) => {
  const { id } = req.params;

  spotifyApi.getAlbumTracks(id)
    .then((data) => {
      //console.log(data.body);
      res.render('albums/tracks', {tracks: data.body.items});
    })
    .catch((error) => console.log('The error while searching album tracks ocurred: ', error))
}