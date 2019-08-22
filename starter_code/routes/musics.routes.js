const express = require('express');
const app = express();
const { beersRoute, randomBeerRoute, index } = require('../controlers/beerRoutes.controler')

app.get('/', index);

app.get('/beers', beersRoute);

app.get('/random-beers', randomBeerRoute);

module.exports = app;