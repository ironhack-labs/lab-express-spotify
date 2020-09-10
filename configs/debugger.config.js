const path = require('path')

const app_name = require('../package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`)

module.exports = debug