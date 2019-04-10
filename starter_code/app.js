const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node")

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

const clientId = '292e81d7af4a4d15afed6b919438fa84',
    clientSecret = 'c3dccb4e5842429bad289e7a890d66d7';

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
app.get("/", (req, res) => {
	res.render("index")
})

app.get("/artists", (req, res) => {
	// console.log(req.query.artistName);
	spotifyApi.searchArtists(req.query.artistName)
    .then(data => {
      // console.log("The received data from the API: ", data.body);
			let artists = data.body.artists.items
			console.log("images: ", artists[0].images)
			res.render("artists", {artists})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:artistId', (req, res, next) => {
  res.send(req.params)
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));





// { artists:
//    { href: 'https://api.spotify.com/v1/search?query=the+beatles&type=artist&offset=0&limit=20',
//      items: [ [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object] ],
//      limit: 20,
//      next:
//       'https://api.spotify.com/v1/search?query=the+beatles&type=artist&offset=20&limit=20',
//      offset: 0,
//      previous: null,
//      total: 41 } }