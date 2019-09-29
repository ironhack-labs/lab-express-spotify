require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/artists', (req, res) => {
    const { artists } = req.query
    spotifyApi
        .searchArtists( artists )
        .then(data => {
            console.log("The received data from the API: ", data.body.artists.items)
            const {items} = data.body.artists
            res.render('artists', {items})
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
})

app.get( "/albums/:id", (req ,res ,next)  => {
    const viewArtist = req.params.id;
    console.log("idArtist ===>: ", viewArtist);  
  spotifyApi
    .getArtistAlbums(viewArtist)
    .then(data => {
      console.log("The received data from the API: ", data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const { items } = data.body;
      res.render('albums', { items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
  });

  app.get("/tracks/:albumId", (req, res, next) => {
    // .getArtistAlbums() code goes here
    const viewAlbum = req.params;
    console.log("idAlbum: ", viewAlbum);  
  spotifyApi
    .getAlbumTracks(viewAlbum.albumId)
    .then(data => {
      console.log("The received data from the API: ", data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const { items } = data.body;
      res.render('tracks', { items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
  })
  



app.listen(3010, () => console.log("My Spotify project running on port 3010 🎧 🥁 🎸 🔊"));