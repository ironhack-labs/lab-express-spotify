const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




// the routes go here:
const index = require("./routes/index")
const artist = require("./routes/artist")
const album = require("./routes/album")
const tracks = require("./routes/tracks")

app.use("/", index);
app.use("/artist", artist);
app.use("/album", album);
app.use("/tracks", tracks);





app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
