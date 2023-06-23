const { MONGO_URI, DATABASE, DB_PASSWORD } = require('./enviroment.config');

const DB_CONFIG = {
  mongo: {
    uri: MONGO_URI.replace('<password>', DB_PASSWORD).replace(
      '<database>',
      DATABASE
    ),
  },
};

module.exports = DB_CONFIG;
