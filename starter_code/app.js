var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// Remember to paste your credentials here
var clientId = '439290c8375c4f13bfbc5b661e5783c2',
    clientSecret = '08d043280ee3477ca2640b5f202954f2';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
    res.render('layout/index');
  });

app.post('/artist', (req, res) => {
    
    spotifyApi.searchArtists(req.body.artist)
    .then(dataRaw => {
        // const data = {artist: dataRaw.body.artists.items[0].name, 
        //             image: dataRaw.body.artists.items.images,
        //             }
    //console.log(data);
     res.render('layout/artist', {data: dataRaw.body.artists.items});

    })
    .catch(err => {
        console.log(`Error en la búsqueda del artista ${err}`);
    })
    
  });

  app.get('/album/:artistId', (req, res) => {

    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(albums => {
        res.render('layout/album', {data: albums.body.items, artist: albums.body.items[0].artists[0].name});
    })
    //
  });
  
  app.get('/track/:trackId', (req, res) => {

    spotifyApi.getAlbumTracks(req.params.trackId)
    .then(track => {

        res.render('layout/track', {data: track.body.items});
    })
    //
  });


app.listen(3000, ()=> console.log('Escuchando puerto 3000'))

