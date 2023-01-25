// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

module.exports.home = (req, res) => {
  res.render('home')
}

module.exports.artist = (req, res) => {
  spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    res.render('artist-search-results', {artists: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.albums = (req, res) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
   res.render('albums', {albums: data.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}

module.exports.tracks = (req, res) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
    res.render('tracks', {tracks: data.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
}