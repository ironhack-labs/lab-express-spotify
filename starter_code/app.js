const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(`${__dirname}/views/partials`);

// setting the spotify-api goes here:
const clientId = 'ce2b2ea9ae5140e3a62e449d0b7b4b84',
    clientSecret = '6df7829473e249a0ad78cd618d6d1576';

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
    })


app.post('/artist', (req, res) => {
  const { artist } = req.body;
  spotifyApi.searchArtists(artist)
   .then(data => {
    res.render('artist', { artist: data.body.artists})
        
      
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
})

app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
    console.log(data.body.items);
    res.render('albums', { albums: data.body.items })
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});
    
app.get('/tracks/:tracks', (req, res, next) => {
  const { tracks } = req.params;
  spotifyApi.getAlbumTracks(tracks)
  .then(data => {
    console.log(data.body);
    res.render('tracks', { tracks: data.body.items })
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));

