const express = require('express');
const hbs = require('hbs');
const bodyparser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

/* 
Client ID - 9fe7d79a9ff648f98829fed5c1e90b37
Client Secret - 827055f0254f480ba1ec6002c6d04698
 */

const clientId = '9fe7d79a9ff648f98829fed5c1e90b37',
clientSecret = '827055f0254f480ba1ec6002c6d04698';

const spotifyApi = new SpotifyWebApi({
clientId : clientId,
clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
.then( data => {
spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
console.log('Something went wrong when retrieving an access token', error);
})

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended: true}))

// setting the spotify-api goes here:

app.get('/', (req, res, next) => {
  res.render('index');
});




// the routes go here:
app.get('/artist', (req, res, next) => {
  
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {

    console.log("The received data from the API: ", );
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let artists = data.body.artists.items;
    res.render('artists', {artists} );
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })



  res.render('artists');
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
