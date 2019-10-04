require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const axios = require("axios");
const qs = require("qs");
const btoa = require("btoa");
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
global.access_token = "";

axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        "Authorization": 'Basic ' + btoa(clientId + ':' + clientSecret) 
    },
    data: qs.stringify({
        grant_type: "client_credentials",
        client_id: clientId
    })
    })
    .then((response)=> {
        access_token = response.data.access_token;
        console.log(access_token);
    })
    .catch((err)=> {
        console.log(err)
})


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials")

const homeRoute = require("./routes/index");
app.use("/", homeRoute);

const artistRoute = require("./routes/artists");
app.use("/", artistRoute);

const albumRoute = require("./routes/albums");
app.use("/", albumRoute);

const trackRoute = require("./routes/tracks");
app.use("/", trackRoute);

app.listen(5000, () => console.log("My Spotify project running on port 5000"));
