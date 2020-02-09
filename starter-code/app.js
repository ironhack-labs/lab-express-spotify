require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});


// Retrieve an access token
spotifyApi.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body["access_token"]))
.catch(error => console.log("Something went wrong when retrieving an access token", error)
	);
  
  
// Our routes go here:
app.get("/", (req, res, next) => {
    res.render("index");
});
  

app.get("/artist-search", (req, res, next) => {
    //console.log("NAME SEARCHED", req.query.artist);
    const searchedArtist = req.query.artist;
    
    spotifyApi.searchArtists(searchedArtist)
    .then( function (data) {
      // console.log("ARTISTS RESULTS:", data.body.artists.items);
      const artistArray = data.body.artists.items;

      // Route to the artist's ID:
      // console.log("ARTIST ID:", data.body.artists.items[0].id)

      // Route to the URL of the artist's photo:
      // console.log("ARTIST PHOTO URL:", data.body.artists.items[0].images[0].url)

    res.render("artist-search-results", { artistArray });
  },
  function (err) {
    console.error(err);
  });
});


app.get("/albums/:artistId", (req, res, next) => {
  // console.log("ARTIST ID", req.params.artistId);
	const artistIdentifier = req.params.artistId;

	spotifyApi.getArtistAlbums(artistIdentifier)
		.then(function (data) {
			// console.log("ALBUMS OF THE ARTIST:", data.body.items);			 
      const albumsArtist = data.body.items;
      
      // Route to the album's ID:
      // console.log("ALBUM ID:", data.body.items[0].id)

      // Route to the URL of the album's photo:
      // console.log("ALBUM PHOTO URL:", data.body.items[0].images[0].url)

			res.render("albums", { albumsArtist });
		},
		function (err) {
			console.error(err);
		});
});


app.get("/tracks/:albumId", (req, res, next) => {
  // console.log("ALBUM ID", req.params.albumId);
  const albumIdentifier = req.params.albumId;
  
  spotifyApi.getAlbumTracks(albumIdentifier)
    .then(function(data) {
      // console.log("SONGS OF THE ALBUM", data.body.items)
      const songsAlbum = data.body.items;
      
      // Route to the song's preview URL:
      // console.log("preview_url":, data.body.items[0].preview_url);

      res.render("tracks", { songsAlbum });
    },
    function(err) {
      console.log('Something went wrong!', err);
    });
});


app.listen(3000, () =>
	console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);