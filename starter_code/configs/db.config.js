const mongoose = require('mongoose');
const MONGODB_URI = ('mongodb://localhost:27017/starter_code')

mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
  .then(() => console.info(`Connected to DB: ${MONGODB_URI}`))
  .catch(error => console.error(`Error to conected to database ${MONGODB_URI}`, error))