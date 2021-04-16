require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
/*spotifyApi
  .searchArtists("artist")
  .then((data) => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch((err) =>
    console.log('The error while searching artists occurred: ', err)
  );   */

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {

  const {artist} = req.query

  spotifyApi
  .searchArtists(artist)
  .then((data) => {

    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', { artists:data.body.artists.items});
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })


  .catch((err) =>
    console.log('The error while searching artists occurred: ', err)

);
})

app.get('/albums/:id/:artistName', (req, res, next) => {

  const artistId = req.params.id;

spotifyApi.getArtistAlbums(artistId)

.then( (result)=> {
  const data = { artistName: req.params.name, albums: result.body.items };
    console.log('Artist albums', data.body);
    res.render('albums', data);

})
  .catch((err) => {console.log('The error while searching artists occurred: ',err);}
);
})

app.get('/view-tracks/:id', (req, res) =>{

  spotifyApi.getAlbumTracks(req.params.id)

  .then((result) => {

    
    res.render('view-tracks', {tracks:result.body.items});
  },

  (err)=> {console.log('Something went wrong!', err);
  });
})







//const router = express.Router();



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
