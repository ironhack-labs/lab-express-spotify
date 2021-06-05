const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

module.exports.home = (req, res, next) => {
    res.render('home')
}

module.exports.artistSearch = (req, res, next) => {
    const {artist} = req.query
    spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
/*       res.send(data.body); */
      res.render('artist-search-results', {artists: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));  
};

module.exports.albumSearch = (req, res, next) => {
    const {artistId} = req.params
    spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
    res.render('albums', {albums: data.body.items})
    }) 
}

module.exports.trackSearch = (req, res, next) => {
    const {albumId} = req.params
    console.log(albumId)
    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
       res.render('tracks', {tracks: data.body.items})
    });
}
