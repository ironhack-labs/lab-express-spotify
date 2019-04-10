const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
const clientId = "8ec8d1dc53c24ae083c7f471a9729a4c",
    clientSecret = "10f5b943f6044e7984a70c5f65b53ea8";

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
});

spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/artists", (req, res) => {
    spotifyApi
        .searchArtists(req.query.artistName)
        .then(data => {
            res.render("artists", { bands: data.body.artists.items });
        })
        .catch(err => {
            console.log('Artist not found Error:', err);
            res.render('artists');
        })
});

app.get("/albums/:idArtist", (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.idArtist)
    .then(data=>{
        res.json(data)
        // res.render("album",{ albums:data.body.items })
    })
    .catch(err=>{
        console.log('Artist not found Error', err);
        res.render('album');
    })
});











// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
