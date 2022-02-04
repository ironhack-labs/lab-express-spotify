require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');
const serverMethods = require('spotify-web-api-node/src/server-methods');

hbs.registerPartials(path.join(__dirname, 'views/partials'));

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
    let data = {};
    let selectedData = [];
    if (searchInput) {
        try {
            data = await spotifyApi.searchArtists(searchInput);
            data.body.artists.items.forEach((item) => {
                // console.log("item.id: ", item.id, typeof item.id);
                if (item.images.length > 0) {
                    selectedData.push({ name: item.name, image: item.images[0].url, href: `/albums/${item.id}`});
                } else {
                    return;
                }
            });
            // console.log("selectedData: ", selectedData);
            // res.send(data);
            res.render("artist-search-results", {artists: selectedData});
        } catch (err) {
            console.log("Something went wrong in /artist-search route, logging err in catch,: ", err);
        }
    } else {
        res.send("No search query -go back and try again!");
}
});

app.get("/albums/:id", async (req, res)=>{
    const { id } = req.params;
    console.log("Logging req.params: ", req.params);
    console.log("Logging id: ", id);
    try {
        const albums = await spotifyApi.getArtistAlbums(id);
        res.send(albums);
    } catch {
        console.log("Something went wrong getting albums,logging err in catch block: ", albums);
    }
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
