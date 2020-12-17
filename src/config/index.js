/* istanbul ignore file */
/* eslint-disable import/no-dynamic-require */
const env = process.env.APP_ENV || 'development'
const config = require(`./${env}`)
config.env = env

module.exports = config
