require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

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

spotifyApi
.clientCredentialsGrant()
.then(data => {
  spotifyApi.setAccessToken(data.body['access_token']);
  //console.log(data)
})
.catch(error => {
  console.log('Something went wrong when retrieving an access token', error);
});


// the routes go here:
app.get('/',(request , response) => {
  response.render('index');
});

app.get('/artists',(request , response) => {
  spotifyApi.searchArtists(request.query.artist)
    .then((data) => {
      let test = data.body.artists.items;
      response.render('artists', {test});
    })
    .catch(error => {
      console.log('Something went wrong when retrieving an access token', error);
    });
});

app.get('/albums', (request,response) => {
    spotifyApi.getArtistAlbums(request.query.artistId)
    .then((data) => {
      //console.log(request.query.artistId);
      //console.log('The received data from the API: ', data.body.items);
      let test = data.body.items;
      response.render('albums', {test});
    })
    .catch(error => {
      console.log('Something went wrong when retrieving an access token', error);
    });
});

app.get('/tracks', (request,response) => {
  spotifyApi.getAlbumTracks(request.query.albumId)
  .then((data) => {
    //console.log(request.query.albumId);
    //console.log('The received data from the API: ', data.body.items);
    let test = data.body.items;
    response.render('tracks', {test});
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });
});

//truncate long strings like names displayed via hbs
hbs.registerHelper('trimString', function(passedString) {
  let maxLen = 28;
  if (passedString.length > maxLen) {
    let theString = passedString.substring(0, maxLen);
    return new hbs.SafeString(theString + ' ...');
  }
  else {
    return passedString;
  }
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
