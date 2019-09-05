const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const clientId = '5f95384b84bc4ffd92d4f0b665a478c5',
    clientSecret = '80faca9426d345a29ccd6dd2b53259a1';

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


  app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.search)
    .then(artistFromApi => {
    const data = {
        artist: artistFromApi.body.artists.items}
        console.log("The received data from the API: ", artistFromApi.body.artists.items);
        res.render('artists', data);
      
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    })  
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req, res, next)
    .then(
        
    )
  });

/*
app.get('/artists/:artist', (req, res, next) => {
  const artist = req.query.search;
  res.send("this is" + artist);
  
})*/


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
