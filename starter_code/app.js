const express = require('express');
const hbs = require('hbs');
const bodyparser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

/* 
Client ID - 9fe7d79a9ff648f98829fed5c1e90b37
Client Secret - 827055f0254f480ba1ec6002c6d04698
 */

const clientId = '9fe7d79a9ff648f98829fed5c1e90b37',
clientSecret = '827055f0254f480ba1ec6002c6d04698';

const spotifyApi = new SpotifyWebApi({
clientId : clientId,
clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
.then( data => {
spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
console.log('Something went wrong when retrieving an access token', error);
})

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended: true}))

// setting the spotify-api goes here:

app.get('/', (req, res, next) => {
  res.render('index');
});


// the routes go here:
app.post('/artist', (req, res, next) => {
  
  spotifyApi.searchArtists(req.body.artist)
  .then(data => {
    let artists = data.body.artists.items;
   
    res.render('artists', {artists} );
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});


app.get('/albums/:artistId', (req, res, next) => {

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    let albums = data.body.items;    
    res.render('albums', {albums} );
  })
  .catch( err => {
      console.log("The error while searching albums occurred: ", err);
    }
  ) ;
});

app.get('/tracks/:albumId', (req, res, next)=>{
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    let tracks = data.body.items;    
    res.render('tracks', {tracks} );
  })
  .catch( err => {
      console.log("The error while searching tracks occurred: ", err);
    }
  ) ;
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
