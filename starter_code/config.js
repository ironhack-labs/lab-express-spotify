const express = require('express');
const hbs = require('hbs');
const apiSpotify = require('./Services/apiSpotify');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');


module.exports = {
  app,
  apiSpotify
}