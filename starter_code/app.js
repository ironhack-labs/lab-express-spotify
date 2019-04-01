const express = require('express');
const hbs = require('hbs');
const app = express();


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials')
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

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
  })





// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
  });

app.get('/artists', (req, res, nest) => {
    spotifyApi.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
    .then(data => {
    console.log("The received data from the API: ", data.body);
    res.render('artist', { artists })
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
})
.catch(err => {
    console.log("The error while searching artists occurred: ", err);
})
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums()
    .then(data => {
        console.log("The received data from the API: ", data.body);
        res.render('album', { albums })
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    })
    }); 


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
