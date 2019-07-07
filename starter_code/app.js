const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = '0a665bb9cfbd47a9aa254570280271b7',
  clientSecret = 'ec5ce3e1ef4548ce872f8f17a241d5da';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })




// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index');
});




app.post('/artists', (req, res) => {
  let artistSearch = req.body.search;
  
  spotifyApi.searchArtists(artistSearch)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let items = data.body.artists.items;
      res.render('artists', { items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })

});
app.get('/albums/:artistId', (req, res, next) => {
  const  artistId  = req.params.artistId;
  
  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      const album = data.body.items;
      // console.log(album);
      res.render('albums', {album});
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
});


app.get('/tracks/:tracksId', (req, res) => {
  // Get tracks in an album
  const  tracksId  = req.params.tracksId;
  
  spotifyApi.getAlbumTracks(tracksId)
    .then(data => {
      const track = data.body.items;
      console.log(track);
      res.render('tracks', { track });
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
