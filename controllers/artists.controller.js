const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

module.exports.home = (req, res, next) => {
    res.render('home')
}

module.exports.search = (req, res, next) => {
     
spotifyApi
    .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('artist-search-results', { data: data.body.artists })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
}

