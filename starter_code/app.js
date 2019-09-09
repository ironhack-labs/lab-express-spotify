const express = require('express');
const hbs = require('hbs');
const dotenv = require("dotenv").config();
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");



// setting the spotify-api goes here:
const clientId = process.env.CLIENT_ID,
    clientSecret = process.env.CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })





// the routes go here:
app.get("/", (req, res) => {
    res.render("index.hbs")
})



//===================================



app.get("/artist", (req, res) => {
    let artist = req.query.search;
    spotifyApi.searchArtists(artist)
        .then(data => {

            console.log("The received data from the API: ", data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            let artist = data.body.artists.items;

            artist.forEach(artist => {
                if (!artist.images[0]) {
                    artist.images.push({
                        url: "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjM7rPlo8PkAhXBjqQKHYF7DQcQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.musixmatch.com%2Falbum%2FA-AP-Rocky%2FBabushka-Boi&psig=AOvVaw01JhAX3tQVkrShlfwcULSq&ust=1568102580417883" //<----- !!!!!!!!!!!
                    })
                }
            })

            res.render("artist", {
                artistList: artist
            })
            //console.log(artist)
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })

})



//===================================



app.get("/albums/:artistId", (req, res) => {
    const artistId = req.params.artistId; //<------ params.artistId is connected to :artistId
    spotifyApi.getArtistAlbums(artistId).then(data => {

        let albums = data.body.items
        res.render("albums", {
            albumsList: albums
        })

    }).catch(err => {
        console.log("Error")
    })
})



//===================================


app.get("/tracks/:trackId", (req, res) => {
    const trackId = req.params.trackId;
    SpotifyWebApi.getAlbumsTracks(trackId).then(data => {

        let track = data.body.items
        res.render("tracks", {
            tracksList: track
        })
    }).catch(err => {
        console.log("Error")
    })
})



app.listen(3005, () => console.log("My Spotify project running on port 3005 🎧 🥁 🎸 🔊"));