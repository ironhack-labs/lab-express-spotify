require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


const bodyParser = require('body-parser');

const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
spotifyApi
.clientCredentialsGrant()
.then(data => {
  spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
  console.log('Something went wrong when retrieving an access token', error);
});

// the routes go here:
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/artists', (req, res)=>{
  spotifyApi
  .searchArtists(req.body.artista)
  .then(data => {
    let artists = data.body.artists.items.map((artist) => {
      return {
        name: artist.name,
        image: artist.images[artist.images.length-1].url
      }
    })
    res.render('artists', {artists})
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
})


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);

