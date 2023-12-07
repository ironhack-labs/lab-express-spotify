const spotifyApi = require('../config/spotifySetup');

// Aqui exportamos todas las funciones que se van a usar en las rutas del routes.js

// controller para '/'
module.exports.renderHome = (req, res, next) => {
  res.render('home');
}

// controller para '/artist-search'
module.exports.getArtistsSearch = (req, res, next) => {
  const { artist } = req.query;

  if (!artist) {
    res.redirect('/');
  }

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      // Por como funciona la librería, data.body, es donde esta la respuesta
      console.log('The received data from the API: ', data.body);

      // Ejemplo para ver como es cada uno de los artistas
      console.log(data.body.artists.items[0]);

      //Renderizamos la vista y le pasamos los items de los artistas que encuentra
      res.render('artists/artistSearch', { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.getAlbums = (req, res, next) => {
  const { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      // Ejemplo para ver la pinta que tiene un album
      console.log(data.body.items[0])
      res.render('albums/albums', { albums: data.body.items });
    })
    .catch(err => console.log('The error while searching artist albums occurred: ', err))

}

module.exports.getAlbumTracks = (req, res, next) => {
  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      console.log(data.body.items);
      res.render('albums/albumTracks', { tracks: data.body.items });
    })
    .catch(err => console.log('The error while searching artist albums occurred: ', err))
}