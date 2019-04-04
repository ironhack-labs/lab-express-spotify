
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '664e2efd43804662a540e5fe84f0b39e'
const clientSecret = 'a106fd701b07452da5b73bd6937afb44'
const spotifyApi = new SpotifyWebApi ({
  clientId,
  clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token'])
    console.log('Conected to Spotify')
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })









module.exports.list = (req,res,next) => {
  const criteria = req.query.artist;
    spotifyApi.searchArtists(criteria)
      .then(data => {
        console.log("The received data from the API: ", data.body);
        res.render('artists/list', data.body.artists)
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
};

module.exports.albums = (req,res,next) => {
  const criteria = req.params.id
  spotifyApi.getArtistAlbums(criteria)
    .then(data => {
      res.render('artists/albums', data.body);
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
};

module.exports.tracks = (req,res,next) => {
  const criteria = req.params.id;
  spotifyApi.getAlbumTracks(criteria, {limit:10, offset:0})
    .then(data => {
      res.render('artists/tracks', data.body);
      // res.send(data)
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    })
}

