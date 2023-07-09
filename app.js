require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
app.get("/", (req,res)=>{
    res.render("index")
   /*  spotifyApi.searchArtists('madonna')
    .then(data => {res.send(data.body.artists.items[0].images)})
    .catch(err => console.log(err))    

   res.send(`<div>
                <h1>Apelidos do Lo</h1>
                <h1>--------------</h1>
                <ul>
                    <li>Zah</li>
                    <li>Mini gay</li>
                    <li>Mini Corno</li>
                    <li>Mini</li>
                    <li>Cg</li>
                    <li>Hd</li>
                    <li>Hdd</li>
                    <li>Saraiva</li>
                    <li>Hpg</li>>
                    <li>Vivi</li>
                    <li>Meu corninho prefeiro</li>

                </ul>
            
            </div>`)*/

    
})

// Our routes go here:



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
