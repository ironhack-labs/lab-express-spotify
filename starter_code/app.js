// Load packages and set app
require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
const app = express();
const axios = require('axios');
const btoa = require("btoa");
const qs = require("qs");
const bodyParser = require('body-parser');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// STEP A: exchanging clientId and clientSecret for an access token
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

axios({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret) //btoa is used to base64 encode the clientId and clientSecret!
                 },
        data: qs.stringify({
                             grant_type: 'client_credentials',
                             client_id: clientId
                          })
     })
     .then((res) => {
        global.access_token = res.data.access_token;
     })
     .catch((err) => {
        res.send(err);
     })


//Routes
app.use('/', require('./routes/index'));
app.use('/artists', require('./routes/artists'));
app.use('/artist', require('./routes/albums'));
app.use('/album', require('./routes/tracks'));

module.exports = app;


// Port and run app
let port = 3000;
app.listen(port, () => console.log("My Spotify project is running on port 3000 🎧 🥁 🎸 🔊"));
