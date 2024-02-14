const express = require('express');
const app = express();

module.exports.home = (req, res, next) => {
    res.render('home')
}