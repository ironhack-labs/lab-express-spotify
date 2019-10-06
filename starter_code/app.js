require('dotenv').config()

const express = require('express');
const app = express();

// body parser
const bodyParser = require('body-parser');

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use(express.static('public'));
// body parser
app.use(bodyParser.urlencoded({ extended: '/public' }));

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


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

// home
app.get('/', (req, res) => {
    res.render('home');
});

// artists
app.get('/artists', (req, res) => {      
    let { name } = req.query;
    
    spotifyApi.searchArtists(name)
        .then(data => {
            let { items } = data.body.artists;
            items.forEach(item => {
              item.images = (item.images.length !== 0) ? item.images[1] : item.images = { url: "data:image/png;base64,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" }
            });
            res.render('artists', { items });
        })
        .catch(err => { console.log("The error while searching artists occurred: ", err) });
});

// albums
app.get("/albums/:artistId", (req, res) => {
  let { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      let { items } = data.body;
      console.log(data.body);
      items.forEach(item => {
        item.images = (item.images.length !== 0) ? item.images[1] : item.images = { url: "data:image/png;base64,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" }
      });
      // res.render('artists', { items });
      res.render('albums', { items }); 
    })
    .catch(err => { console.log("The error while searching artists occurred: ", err) });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
