const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '3e7e329c3e4a474bb415cd7a7f3f59d4';
clientSecret = 'b6ca57b7d65443b296dde6d3cfcdc0d3';
const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

module.exports.home = (req, res, next) => {
  res.render('index');
  console.log('adios')
};  

module.exports.list = (req,res,next) => {
console.log('hola')
  spotifyApi.searchArtists(req.query.artist)
      .then(data => {
  
        console.log("The received data from the API: ", data.body);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artists', {data});
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
  };