require('dotenv').config();

const { Router } = require('express');
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const path = require('path');

// const userRoutes = require('express').Router();
// userRoutes.get("/profile")
// app.use("/user", userRoutes)
// /user/profile

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:
app.get("/", (req, res) => { res.render("index") })

app.get("/artist-search", (req, res) => {

    //recibir nombre de la busqueda
    const searchArtist = req.query
     console.log(searchArtist.search, "<====")


    //pintar info de un artista
    spotifyApi
        .searchArtists('req.query.search')
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", {artists:data.body.artists.items})
            console.log(data, "holaaa")
            
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
