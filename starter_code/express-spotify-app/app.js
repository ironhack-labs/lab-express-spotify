const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// Remember to paste your credentials here
const clientId = "fcbe5c9bafc44950b2f50f4ca18fb7e2",
  clientSecret = "8ca60a7ae9764e769746e05f7fb4850c";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/artists", function(req, res) {
	const {artist} = req.query;

	const queryArtist = spotifyApi.searchArtists(artist);
	queryArtist.then(data => {
			let artistList = data.body.artists.items;
			console.log(data)
			res.render('artists', {artistList});
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })

});

app.get("/albums/:artistId", function(req, res){
console.log(req.params.artistId)
	const {artistId} = req.params;
	const queryAlbums = spotifyApi.getArtistAlbums(artistId);
	queryAlbums.then(
		function(data) {
			//console.log(data.body.items);
			let artistAlbum = data.body.items;
			res.render('albums',{artistAlbum});
		},
		function(err) {
			console.error(err);
		}
	);
});


app.get("/albums/tracks/:albumId", function(req, res){
	//console.log(req.params.albumId)
		const {albumId} = req.params;
		const queryTracks = spotifyApi.getAlbumTracks(albumId);
		queryTracks.then(
			function(data) {
				let { items } = data.body;
				res.render('tracks',{items});
				console.log({items});
			},
			function(err) {
				console.error(err);
			}
		);
	});


// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.listen(3000, () => console.log("Example app listening on port 3000!"));
