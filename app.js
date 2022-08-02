require('dotenv').config();

const express = require('express');
const hbs = require('hbs');





// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next)=> {
    res.render('index');
});


app.get('/artist-search', (req, res, next) => {
spotifyApi
  .searchArtists(req.query.artist) /* this is an object, and can take more than query */
  .then(data => {
    /* console.log('The received data from the API: ', data.body.artists.items) */; 

    /* data = placeholder / body = part of data you're receiving from api / artists = first objetct name 
    from result / items = name of the array containing the results we want */
    
    
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render("artistSearchResults", {artists: data.body.artists.items})
    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(function(data) {
          console.log(data.body.items)
          res.render('albums', {albums:data.body.items})
        },
        function(err) {
          console.error(err);
        }
      );
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
