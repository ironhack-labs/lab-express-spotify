const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');



app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:true}));

app.set('views',  __dirname + '/views');

app.set('view engine', 'hbs');



// setting the spotify-api goes here:
const clientId = '24752d61659a43f18636ccacde0a1664',
    clientSecret = '0c6c1bbdb3ca433a8703894d29e7dca7';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  },function(error){
    console.log('Something went wrong when retrieving an access token', error);
});

// the routes go here:

//render index page
app.get('/', (req,res,next) => {
    res.render('index');
});
//render artist page
app.get('/artists', (req, res, next) => {
    //req general query
    const {artist} = req.query;
    //call search artist
    spotifyApi.searchArtists(artist)
        .then(data => {
          const items = data.body.artists.items;
  
          res.render('artists',{items});
        })
        .catch(err => {
       console.log("fail" + err);
        });
});

//get artist-album
app.get('/artists/:artistId', (req, res) => {
    // code
    const artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            const albums = data.body.items;
            console.log(albums);
            // res.render('albums', {albums});
            res.render('albums', {result: data.body.items});
        })
        .catch(err => {
          console.error(err);
        });
});


//get tracks
app.get('/albums/:albumId', (req,res) =>{
    const albumId = req.params.albumId;
    console.log(albumId);
    spotifyApi.getAlbumTracks(albumId)
        .then(data =>{
            res.render('tracks', {tracks: data.body.items});
        })
        .catch(err =>{
            console.log(err);
        });
});
















app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
