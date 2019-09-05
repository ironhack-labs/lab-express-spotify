const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// Middleware for body-parsing:
app.use(express.urlencoded( {extended: false}))


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = 'dfe9771b89c842deb841b50e6239ed15',
    clientSecret = '05e496f2688742aba19ce5f68fd042ef';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

const serveHome = (request, response, next) => {
  response.render('index');
}

const serveArtists = (request, response, next) => {
  spotifyApi.searchArtists(request.body.searchquery)
    .then(data => {
      // console.log("Received the following from Spotify API:\n", data.body)
      response.render('artists', data.body.artists)
    })
    .catch(err => {
      console.log("An error occurred while searching artists: ", err);
    })
};

const serveAlbums = (request, response, next) => {
  spotifyApi.getArtistAlbums(request.params.artistId)
    .then(data => {
      // console.log("Received the following from Spotify API:\n", data.body)
      // We don't have easy access to the band name without another API call or this mess:
      let bandName = data.body.items[0].artists[0].name;
      data.body.bandName = bandName;
      response.render('albums', data.body);
    })
    .catch(err => {
      console.log("An error occurred while retrieving albums: ", err);
    })
}

const serveTracks = (request, response, next) => {
  spotifyApi.getAlbumTracks(request.params.albumId)
    .then(data => {
      // console.log('\n\n', data.body, '\n\n');
      response.render('tracks', data.body);
    })
    .catch(err => {
      console.log("An error occurred while retrieving tracks: ", err);
    })
}


// the routes go here:
app.get('/', serveHome);
app.post('/artists', serveArtists);
app.get('/albums/:artistId', serveAlbums);
app.get('/tracks/:albumId', serveTracks);


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
