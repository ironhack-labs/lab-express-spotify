require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');
const serverMethods = require('spotify-web-api-node/src/server-methods');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
//   Retrieve an access token
//   spotifyApi
//     .clientCredentialsGrant()
//     .then(data => {
//         spotifyApi.setAccessToken(data.body['access_token']);
//     })
//     .catch(error => console.log('Something went wrong when retrieving an access token', error));

async function getAccesToken(){
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
    } catch(err) {
        console.log('Something went wrong when retrieving an access token, logging error in catch block: ', err);
    }
}

getAccesToken();

app.get("/home", (req, res)=> {
    res.render("home");
});

app.get("/artist-search", async (req, res)=> {
    const { searchInput } = req.query;
    // console.log("Logging searchInput: ", searchInput);
    let data = {};
    let selectedData = [];
    try {
        data = await spotifyApi.searchArtists(searchInput);
        console.log("RetrievedArtist: ", data);
    } catch (err) {
        console.log("Something went wrong in /artist-search route, logging err in catch,: ", err);
    }
    data.body.artists.items.forEach((item) => {
        selectedData.push({ name: item.name, image: item.images[0].url},);
    });
    console.log("selectedData: ", selectedData);
    const inputToRender = {artists: selectedData};
    // res.send(data);
    res.render("artist-search-results", inputToRender);
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
