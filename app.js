require('dotenv').config();

const express       = require('express');
const hbs           = require('hbs');
const app           = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Register the location for handlebars partials here:
hbs.registerPartials(__dirname + "/views/partials");

// Setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error => console.log("Something went wrong when retrieving an access token", error));



/********************/
/*      Routes      */
/********************/

// Home
app.get("/", function (req, res){
    res.render("index");
});


// Artist search
app.get("/artist-search", (req, res) => {
  const { artist } = req.query; //e.g. if query == beatle, saves query 'beatles' in object
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items);
    res.render("artist-search-results", { artist: data.body.artists.items}) // the hbs artist-search-.. receives the properties stored in data.body.artists.items
  })
  .catch(err => console.log("The error while searching artists occurred: ", err));
})


// View albums
app.get("/album/:artistId", (req, res) => {
  const id = req.params.artistId;
  spotifyApi
  .getArtistAlbums(id)
  .then(data => {
    //console.log(data.body.items);
    res.render("album", { album: data.body.items });
  })
  .catch(error => console.log(error));
})


// Listen to tracks
app.get("/track-info/:albumId", (req, res) => {
  const id = req.params.albumId;
  spotifyApi
  .getAlbumTracks(id)
  .then(data => {
    console.log(data.body.items);
    res.render("track-info", { track: data.body.items });
  })
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
