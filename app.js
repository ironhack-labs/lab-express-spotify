require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', hbs);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/',(req,res) => {
    res.render('index.hbs');
});

app.get('/artist-search',(req,res,next) => {
  let query = req.query.search;

  spotifyApi
  .searchArtists(query)
  .then(data=>{
    var artists = data.body.artists.items
    res.render('artist-search-results.hbs',{artists})
  }).catch(error =>console.log(`The error while searching artists occured ${error}`))


})

app.get('/albums/:artistId', (req, res,nxt) =>{
  var id = req.params.artistId;

  spotifyApi
  .getArtistAlbums(id)
  .then(data =>{
    var albums = data.body.items

    // console.log(albums)
    //console.log(data.body);

    res.render('albums.hbs', {albums} );

  }).catch(err =>console.log(err))

});


app.get('/tracks/:albumId', (req, res, next) =>{
  var id = req.params.albumId;
  
  spotifyApi
  .getAlbumTracks(id)
  .then(data =>{
    var tracks = data.body.items

    console.log(tracks)

    res.render('tracks.hbs',{tracks})

  }).catch(err =>console.log(err))


})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
