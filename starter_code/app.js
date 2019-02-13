const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser'); //needed for req.body
const app = express();

app.use(bodyParser.urlencoded({ extended: true })); //needed for req.body

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const clientId = '13284d31ccb34468827e7799a2f6fddd',
    clientSecret = 'a99d8b952bb94bdd8c5068bcfb176adf';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res, next) => {
    console.log(req.body, req.params, req.query);
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        console.log(data.body.artists.items);
        //console.log("The received data from the API: ", data.body);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        //res.send(data.body.artists.items[0].name);
        res.render('artists', {myArtists: data.body.artists.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
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
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));