var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')

module.exports = {
  development: {
    root: rootPath,
    db: 'mongodb://localhost/ppeti',
    app: {
      name: 'BlogTest'
    },
  },
  test: {
    root: rootPath,
    db: 'mongodb://localhost/ppeti',
    app: {
      name: 'BlogTestTest'
    },
  },
  production: {
    root: rootPath,
    db: 'mongodb://10.0.1.30/ppeti',
    app: {
      name: 'BlogTest'
    },
  }
}