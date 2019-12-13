require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.render('index');
});


spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log("successfully retreived Access Token at " + (new Date()));
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

  
  app.get('/artists', function (req, res){
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', data.body);
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
    
  });
  



app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
