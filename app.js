require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


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



//middlewate for parsing json an form-data requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


// Our routes go here: API constanty -- SpotifyWebApi
app.get("/", (req, res) => {
    res.render("index")
  })

app.get("/artist-search", (req, res) => {
  

    spotifyApi
        .searchArtists(req.query.artist)
        .then((data) => {
          return data.body.artists;
        }) 
        .then((receivedData) => {
            const results = receivedData.items
            return results
        })
        .then((foundArtists) => {
            res.render("artist-search-results", { artistList: foundArtists})
        })
        .catch ((err) => {
          console.error(err);
        });

})

app.get("/artist/albums/:artistId", (req, res) => {
    const artistId = req.params.artistId;

    spotifyApi
        .getArtistAlbums(artistId)
        .then((data) => {
            return data.body.items;
            
        })
        .then((foundAlbums) => {
            res.render("albums", { albumsList: foundAlbums})
        })
        .catch ((err) => {
          console.error(err);
        });

  });

  app.get("/artist/tracks/:artistId", (req, res) => {
    const artistId = req.params.artistId;

    spotifyApi
        .getAlbumTracks(artistId)
        .then((data) => {
            return data.body.items;
            
        })
        .then((foundTracks) => {
            res.render("tracks", { tracksList: foundTracks})
        })
        .catch ((err) => {
          console.error(err);
        });

  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
