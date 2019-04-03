/*const createError = require('http-errors');
const mongoose = require('mongoose');
const Artist = require('../models/artist.model');

module.exports.list = (req, res, next) => {
  const criteria = {};
  if (req.query.title) {
    criteria.title = new RegExp(req.query.title, 'i');
  }
  Artist.find(criteria)
    .then(artists => res.render('artists/list', { 
      artists, 
      title: req.query.title 
    }))
    .catch(error => next(error));
}

module.exports.details = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(createError(404, 'artist not found'))
  } else {
    Artist.findById(id)
      .then(artist => {
        if (artist) {
          res.render('artists/details', { artist })
        } else {
          next(createError(404, 'artist not found'))
        }
      })
      .catch(error => next(error));
  }
}
*/