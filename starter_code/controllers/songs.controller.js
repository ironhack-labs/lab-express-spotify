const createError = require('http-errors');
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '8897073bbcb646e3991e7c81910d6353',
	clientSecret = '1ff5764a4b5e4dbeb1c0e31bafe7f75f';

const spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret,
});


module.exports.list = (req, res, next) => {
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body['access_token']); // hay que meterlo debajo de aqui pk
      // es una promesa y está esperando comprobar las credenciales, luego en la ruta tiene que ir bien
      spotifyApi.searchArtists(req.query.search)
        .then(data => {
          console.log('The received data from the API: ', data.body.artists.items[0]);
          const dataMy = data.body.artists.items
          res.render('songs/list',{
            artists: dataMy
          })
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
          console.log('The error while searching artists occurred: ', err);
        });
    })
    .catch(error => {
      console.log('Something went wrong when retrieving an access token', error);
    });
}

/* spotifyApi
			.searchArtists("Melendi")
			.then(data => {
				console.log('The received data from the API: ', data.body);
				// ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
			})
			.catch(err => {
				console.log('The error while searching artists occurred: ', err);
			}); */