const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
// require spotify-web-api-node package here:


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '8ed54fa63c6a42c8b370b1878fbb92fe',
    clientSecret = '7747d1659cc04d328353410151b6912b';

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

// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
  });

  app.get('/artists', (request, response) => {
    spotifyApi.searchArtists(request.query.artistSearch)
      .then(data => {
        // console.log("The received data from the API: ", data.body.artists.items);
        const artistsArray = data.body.artists.items;
        response.render('artists',
          { artistsArray }
        );
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
  });
  

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
  