require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const axios = require("axios");
const qs = require("qs");
const btoa = require("btoa");
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
global.access_token = "";



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const homeRoute = require("./routes/index");
app.use("/", homeRoute);

const artistRoute = require("./routes/artists");
app.use("/", artistRoute);

app.listen(3000, () => console.log("My Spotify project running on port 3000"));
