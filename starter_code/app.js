const express = require('express')
const hbs = require('hbs')
const path = require('path')
const spotifyApp = require('spotify-web-api-node')

require('dotenv').config()


const clientSecret = process.env.CLIENTSECRET
const clientId = process.env.CLIENTID

const spotifyApi = new spotifyApp({
  clientId: clientId,
  clientSecret: clientSecret
})

const app = express()
hbs.registerPartials(__dirname + '/views/partials')

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(__dirname + '/public'))


// setting the spotify-api goes here:

spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })




// the routes go here:
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artists', (req, res) => {

    spotifyApi.searchArtists(req.query.artist)
      .then(data => {
        let items = data.body.artists
        console.log("The received data from the API: ", data.body.artists);
        res.render('artists', items)
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })

  }

)

app.get("/albums/:artistId", (req, res) => {
  let artistId = req.params.artistId;

  spotifyApi.getArtistAlbums(artistId).then(
    function (data) {
      console.log("Artist albums", data.body);
      let albumList = data.body.items;
      res.render("albums", {
        albumList
      });
    },
    function (err) {
      console.error("The error while searching albums occurred: ", err);
    }
  );
})

app.get("/tracks/:albumId", (req, res) => {
  let albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId, {
    offset: 1
  }).then(
    function (data) {
      let trackList = data.body.items;
      res.render("tracks", {
        trackList
      });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));