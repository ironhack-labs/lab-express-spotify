var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')
const bodyParser = require('body-parser')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste here your credentials
var clientId = 'eb2ba474fa914ed088d7cc794bb3477a',
    clientSecret = 'd543bb63b8e54cc1a4598e3921149778';

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

app.get('/', function (req, res){
  res.render('index')
})

app.post('/artists', (req, res, next)=> {
  console.log('posting!')

  const theArtist = req.body.theArtistInput;

  console.log(theArtist)
  spotifyApi.searchArtists(theArtist)
    .then(data => {
      console.log('#######################');
      console.log(data);
      let spotReturn = data.body.artists
      console.log('#######################');

      console.log(spotReturn.items.images);
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$')
      res.render('artists', spotReturn)
    })
    .catch(err => {
     console.log(err)
    })

})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    const albums = data.body.items
    // console.log(data.body.albums);
    // console.log('&&&&&&&&');
    // console.log(id.href)
    res.render('albums', {artistAlbums: albums})
    console.log(albums)
  })
  .catch(err => {
    console.log(err)
  })
});

app.get('/tracks/:albumID', (req, res)=> {
  spotifyApi.getAlbumTracks(req.params.albumID)
  .then(data => {
    const tracks = data.body.items

    res.render('tracks', {albumTracks: tracks})
    console.log(tracks)
  })
  .catch(err => {
    console.log(err)
  })
})


app.listen(3000);