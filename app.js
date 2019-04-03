const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const indexRouter = require('./routes/index');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

// setting the spotify-api goes here:
const clientId = '3e7e329c3e4a474bb415cd7a7f3f59d4';
clientSecret = 'b6ca57b7d65443b296dde6d3cfcdc0d3';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

//Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })



// the routes go here:
app.use('/', indexRouter);
app.get('/artists', (req,res,next) => {

spotifyApi.searchArtists(req.query.artist)
    .then(data => {

      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', {data});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));

//no entiendo porqué el data del primer then de la api es toda la info...