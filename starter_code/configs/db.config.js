const mongoose = require('mongoose');
const DB_NAME = 'spotify';
const URI = `mongodb://localhost/${DB_NAME}`;

mongoose.connect(URI)
  .then(() => `Connected to ${DB_NAME}`)
  .catch(err => console.error(err));