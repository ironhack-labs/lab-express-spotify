const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = 'bc601c18f9be413f93bc2e24eab366ec',
    clientSecret = 'c0ae5ac7f5b1458fa6b4e7ec6471e7f4';

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
app.get('/', function (req, res) {
  res.render('homepage')
})
app.post('/artists', (req, res, next) => {
  console.log(req.body);
    spotifyApi.searchArtists(req.body.artistsSearch)
        .then(data => {
         console.log("The received data from the API: ", data.body.artists.items[0]);
         res.render('artists', data.body.artists.items[0]);
          // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
          console.log("The error while searching artists occurred: ", err);
        })
  })

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
