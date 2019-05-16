const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '60c85ef914af4e028445425078daff0e',
  clientSecret = '3912042415944db09ff9504ca0ed9587';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })





// the routes go here:
app.get("/", (req, res, next) => res.render("index"))

app.get('/artists', (req, res) => {
  console.log('La query string: ', req.query)
  console.log(req.query.artist)
  spotifyApi.searchArtists(req.query.artist) //`'${req.query.artist}' `
    .then(data => {

      let items = data.body.artists.items

      console.log("The received data from the API: ", items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists', { items })

    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get('/albums/:id', (req, res, next) => {
  // console.log("El id es", req.params)
  spotifyApi.getArtistAlbums(req.params.id, { limit: 10, offset: 20 })
    .then(
      function (data) {
        let items = data.body.items
        let artist = req.params.artist
        console.log('Album information', data.body);
        // console.log("EL ARTISTA ES", req.params.artist)
        res.render('albums', { items })
      },
      function (err) {
        console.error(err);
      }
    );
});
app.get('/tracks/:id', (req, res, next) => {
  console.log(req.params.id)
  spotifyApi.getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
    .then(function (data) {
      console.log(data.body);
      let items = data.body.items
      console.log("*******ITEMS", items)
      res.render('tracks', { items })
    }, function (err) {
      console.log('Something went wrong!', err);
    });
})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
