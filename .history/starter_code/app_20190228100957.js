const express       = require('express');
const hbs           = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));




// setting the spotify-api goes here:
// const clientId = '4e00e7b6dc75438d85abd08fdeb95344',
// clientSecret =  '983c8a38e9534cdeb562c48d3f3f26f6',
// redirectUri = 'localhost:3000/callback';


// var spotifyApi = new SpotifyWebApi(credentials);

// The code that's returned as a query parameter to the redirect URI


// const spotifyApi = new SpotifyWebApi({
//   clientId: clientId,
//   clientSecret: clientSecret
// })

// spotifyApi.clientCredentialsGrant()
//   .then(function(data) {
//     spotifyApi.setAccessToken(data.body['access_token']);
//   }, function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
// });

const clientId = '4e00e7b6dc75438d85abd08fdeb95344',
clientSecret =  '983c8a38e9534cdeb562c48d3f3f26f6',
redirectUri = 'localhost:3000/callback';

 
// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});
 
// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
 
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/artists", (req, res) => {

  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    let resultArray = data.body.artists.items
    // console.log(data.body.artists.items);
    res.render("artistfound", {resultArray})
    console.log(resultArray);
  })
  .catch(err => {
   console.log("an error occured!" + err)
  })

})


// the routes go here:
const index = require('./routes/index');
app.use('/', index);




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
