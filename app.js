require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req,res) => {
    res.render("index")
});

//localhost:3000/artist-search?artist=zoe

app.get('/artist-search', (req, res) => {
    spotifyApi
      .searchArtists(req.query.artist)
      .then((data) => {
        // console.log('The received data from the API: ', data.body.artists.items[0]);
        const artistsData = {
          artistSearch: req.query.artist,
          artistsList: data.body.artists.items
        }
        res.render('artist-search-results', artistsData);
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });

//localhost:3000/albums/id
app.get("/albums/:idArtista",(req,res) =>{
    spotifyApi.getArtistAlbums(req.params.idArtista)
    .them((data) => {
        res.render("albums", data.body)
    })
    .catch(err => console.log(err))
   
})

//localhost:3000/tracks/:idAlbum
app.get("/tracks/:idAlbum", (req,res) => {
    spotifyApi
    .getAlbumTracks(req.params.idAlbum)
    .then ((data) => {
        res.render("tracks", data.body)
    })
    .catch(err => console.log(err))
    
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
