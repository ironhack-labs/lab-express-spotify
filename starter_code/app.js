require('dotenv').config();

const path = require('path');
const express = require('express');
const hbs = require('hbs');
const router = require('./routes/index');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use('/', router);

app.listen(process.env.PORT, () => console.log(`Server up on http://localhost:${process.env.PORT}`));
