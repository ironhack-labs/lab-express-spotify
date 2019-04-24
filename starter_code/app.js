const express = require('express');
const hbs = require('hbs');
require('dotenv').config()

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');




// Remember to insert your credentials here
const clientId = '12445debe99b40fb995feea938fcd4c8',
    clientSecret = process.env.TOKEN;

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



  // Express Constants

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

// spotifyApi.searchArtists(artist)
//     .then(data => {

//       console.log("The received data from the API: ", data.body);
//       // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//     })
//     .catch(err => {
//       console.log("The error while searching artists occurred: ", err);
//     })




// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/search', (req, res, next) => {
  artist = req.query;
  
  spotifyApi.searchArtists(artist.artist)
    .then(data => {

      //console.log("The received data from the API: ", data.body);
      items = data.body;
      // console.log("==================", items.artists.items);
      res.render('artists', {items: items.artists.items});
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  //res.send(req.query);
  

  // ALBUMS Request
  app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here

        album = req.params.artistId;
        
        spotifyApi.getArtistAlbums(album)
    .then(data => {

      console.log("The received data from the API: ", data.body);
      albums = data.body;

      console.log("==================", albums.items);

      res.render('albums', albums.items);
     
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
  });
  

})
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
