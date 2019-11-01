require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require("spotify-web-api-node")



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });


// the routes go here:

app.get('/artists',(req, res) => {
    spotifyApi
    .searchArtists(req.query.artist_name)
    .then(data => {
        //return res.send(data)
        //console.log("The received data from the API: ", data.body);
        res.render('artists', data.body.artists)
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    });
})

app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
    .getArtistAlbums(`${req.params.artistId}`)
    .then(data => {
        //return res.send(data)
        res.render('albums', data.body)
    })
    .catch(err => {
        console.log("The error while searching albums occurred: ", err);
    })
  });

  app.get("/tracks/:albumId", (req, res, next) => {
    spotifyApi
    .getAlbumTracks(`${req.params.albumId}`)
    .then(data => {
        //return res.send(data)
        res.render('tracks', data.body)
    })
    .catch(err => {
        console.log("The error while searching albums occurred: ", err);
    })
  });

app.get('/',(req, res) => {
    res.render('home')
})




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
