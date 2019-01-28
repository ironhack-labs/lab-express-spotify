const express       = require('express');
const app           = express();
const hbs           = require('hbs');
const path    = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials');

// Remember to paste your credentials here
var clientId = '748163d04b244277b8e0deaf2eeca98e',
    clientSecret = 'a4bf9aec6a4341d8a01e78028bbd3f9f';

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

app.get('/', (req,res,next) => {
  res.render('homepage')
})


app.get('/artists', (req,res,next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      const artistsInfo = data.body.artists.items;
      res.render('artists', {artistsInfo});
    })
    .catch(err => {
      res.send("CRASH(artist)" + err);
    })
})


app.get('/albums/:artistId', (req, res, next) => {

  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      const albumInfo = data.body.items;
      // console.log(albumInfo);
      // res.send(albumInfo);
      res.render('albums', { albumInfo }) 
    })
    .catch(err => {
      console.log("CRASH(albums)", err)
    });

})

app.get('/tracks/:id', (req, res, next) => {

  spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {
    const tracks = data.body.items;
    // res.send(tracks);
    res.render('tracks', { tracks })
 })
   .catch(err => {
     res.send(err)
    });
})


app.listen(3000, () => console.log('Listening on port 3000!'))