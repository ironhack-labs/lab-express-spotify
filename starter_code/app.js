const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');

// Remember to insert your credentials here
const clientId = 'c5a00d99bb284c45a3251dbc90189608';
const clientSecret = '4a19b03fee0c4cab9d399a1ec47db08a';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  const artist = req.query.search;
  spotifyApi.searchArtists(artist)
  .then(data => {       
    res.render('artists', { search: data.body.artists});
})
  .catch(err => {
    console.log('error', err);
    });
});

app.get('/albuns/:artistId', (req, res, next) => {
  const albunsArtist = req.params.artistId; 
  spotifyApi.getArtistAlbums(albunsArtist)
  .then(data => {      
    res.render('albuns', { search: data.body});
})
  .catch(err => {
    console.log('error', err);
    });
});

app.get('/tracks/:tracksId', (req, res, next) => {
  const tracksAlbum = req.params.tracksId;   
  spotifyApi.getAlbumTracks(tracksAlbum)
  .then(data => {     
    res.render('tracks', { search: data.body});
})
  .catch(err => {
    console.log('error', err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
