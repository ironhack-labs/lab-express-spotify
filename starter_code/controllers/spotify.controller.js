const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:

const clientId = 'ed3e9ebcc0464804bbae70185122d9cc',
    clientSecret = 'bf5e605f3df440d5b31f1abc2f339912';
const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

module.exports.main = (req, res, next) => {
  res.render('main.hbs');
}

module.exports.list = (req, res, next) => {
  const artist = req.query.name;
  spotifyApi.searchArtists(artist)
    .then(data => {

      console.log("The received data from the API: ", data.body);
      res.render('artist.hbs', data.body);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
}

module.exports.albums = (req, res, next) => {
  const artist = req.params.id;
  console.log(artist)
  spotifyApi.getArtistAlbums(artist)
  .then(function(data) {
    console.log('Artist albums', data);
    console.log(data.body.items[0])
  }, function(err) {
    console.error(err);
  });
}