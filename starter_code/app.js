const express = require('express');
const hbs = require('hbs');
require('dotenv').config();

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






// Routing
app.get('/', (req, res, next) => {
  res.render('index');
});

// ARTISTS Request
app.get('/search', (req, res, next) => {
  artist = req.query;
  
  spotifyApi.searchArtists(artist.artist)
    .then(data => {

      console.log("The received artist data from the API: ", data.body);
      items = data.body;
      // console.log("==================", items.artists.items);
      res.render('artists', {items: items.artists.items});
      
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
  
  

  // ALBUMS Request

  app.get('/albums/:artistId', (req, res, next) => {
    

        album = req.params.artistId;
        
        spotifyApi.getArtistAlbums(album)
    .then(data => {

        console.log("The received album data from the API: ", data.body);
        albums = data.body;

        console.log("==================", albums);

        res.render('albums', albums);
     
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
  });

  




  // TRACKS Request

  app.get('/tracks/:tracksId', (req, res, next) => {
    

    tracks = req.params.tracksId;
    
    spotifyApi.getAlbumTracks(tracks)
  .then(data => {

    console.log("The received track data from the API: ", data.body);
    tracks = data.body;

    //console.log('XXXXXXXXXXXXXXXXXXXX', tracks.items);

    res.render('tracks', tracks);
 
})
  .catch(err => {
    console.log("The error while searching tracks occurred: ", err);
})
});
  

})

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
