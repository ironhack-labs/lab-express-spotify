require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// Our routes go here:
app.use("/", require("./routes/index"));
app.use("/artist-search", require("./routes/search-routes/search"));
app.use("/albums", require("./routes/search-routes/search-albums"));


app.listen(3000, () => console.log('My Spotify project running on port 3000'));

module.exports = app;

