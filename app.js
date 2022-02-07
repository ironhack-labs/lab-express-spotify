require('dotenv').config();

const express = require('express');
const {res} = require('express/lib/response');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});



  // Retrieve an access token
    spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// setting the spotify-api goes here:

// Our routes go here:

app.get("/",(req, res, next) => {
    res.render("index")
});

app.get('/artist-search',(req,res,next)=>{
    spotifyApi
        .searchArtists(req.query.artistName)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            res.render("artist-search-results", { artist: data.body.artists.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/:artist/albums/:artistId", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
      const albums = {
        albumArr: data.body.items,
        artist: data.body.items[0].artists[0].name,
      };
      res.render("albums", { albums });
    });
  });
  
  // View tracks of specific album
  app.get("/:album/tracks/:albumId", (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId).then((data) => {
      const tracks = {
        trackArr: data.body.items,
        artist: data.body.items[0].artists[0].name,
      };
      res.render("tracks", { tracks });
    });
  });
  

app.get('/albums/:artistsId',(req,res,)=>{
    spotifyApi
    .getArtistsAlbum(req.params.artistId)
    .then(data=>{
        const albumData = {
            album: data.body.items,
            artist: data.body.items[0].name
        }
        console.log(data.body.items)
        res.render('albums', albumData)
    })
    .catch()
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
