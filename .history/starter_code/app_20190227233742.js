const express       = require('express');
const hbs           = require('hbs');
const SpotifyWebApi = require('spotify-web-api-js');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));




// setting the spotify-api goes here:
const clientId = '4e00e7b6dc75438d85abd08fdeb95344',
clientSecret =  '983c8a38e9534cdeb562c48d3f3f26f6',
redirectUri = 'localhost:3000/callback';


// var spotifyApi = new SpotifyWebApi(credentials);

// The code that's returned as a query parameter to the redirect URI


const spotifyApi = new SpotifyWebApi({
clientId : clientId,
clientSecret : clientSecret,
redirectUri : redirectUri
});
const code = 'MQCbtKe23z7YzzS44KzZzZgjQa621hgSzHN';


// Retrieve an access token
spotifyApi.clientCredentialsGrant(code)
.then( data => {
  spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
  console.log('Something went wrong when retrieving an access token', error);
})







// the routes go here:
const index = require('./routes/index');
app.use('/', index);




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
