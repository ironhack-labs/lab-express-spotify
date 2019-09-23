require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


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
  .catch(err => {
    console.log("Something went wrong when retrieving an access token", err);
  });

// the routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/artists', (req, res) => {
  let { artist } = req.body;
  //let { artists } = req.body.artists.items;
  console.log(req.body)
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let { items } = data.body.artists;
    
    /*
    items.forEach( item => {
      item.image = item.images[0];
      //item.image_url = JSON.parse(item.image.url)
    })*/
    
    res.render('artists', {items: items})
    
    //res.send(items)

  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
  
})

app.get('/albums/:artistId', (req, res) => {

  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then( data => {
    console.log('Artist albums', data.body);
    let { items } = data.body;

    res.render('albums', {items} )

    //res.send(items)
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });

});

app.get('/tracks/:albumId', (req, res) => {

  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then( data => {
    console.log('Album tracks', data.body);
    let { items } = data.body;

    res.render('tracks', {items} )

    //res.send(items)
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });

});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
