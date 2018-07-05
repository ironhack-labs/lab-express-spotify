'use strict';

const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');