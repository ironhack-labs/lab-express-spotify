const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = 'ea9752a08e564b77b9ce13390bde5d84',
    clientSecret = '0db31e795b7646e58fee61629fb744b4';

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

const app = express();



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');


app.get('/', (request, response, next) => {
    response.render('index');
  });


app.get('/artists', (request, response, next) => {
    console.log(request.query.search)
  spotifyApi.searchArtists(request.query.search)
  .then(artistFromApi => {
      const data = {
          artist: artistFromApi.body.artists.items
      }

    console.log("The received data from the API: ", artistFromApi.body.artists.items);
    response.render('artists', data);

  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});  







 



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
