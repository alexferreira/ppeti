
/**
 * Module dependencies.
 */

var async = require('async')
  , users = require('../app/controllers/users')
  , tags = require('../app/controllers/tags')
  , perguntas = require('../app/controllers/perguntas')
  , respostas = require('../app/controllers/respostas')
  , pages = require('../app/controllers/pages');

module.exports = function (app, passport, auth) {
  app.get('*', tags.list)

  // user routes
  app.get('/signup', users.signup)
  app.post('/users', users.create)
  app.get('/logout', users.logout)
  app.get('/login', users.login)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/:userId', users.show)
  app.get('/users/:userId/edit', users.edit)
  app.put('/users/:userId', auth.requiresLogin, users.update)

  app.param('userId', users.user)

  // pergunta routes
  app.get('/perguntas', perguntas.index)
  app.get('/perguntas/new', auth.requiresLogin, perguntas.new)
  app.post('/perguntas', auth.requiresLogin, perguntas.create)
  app.get('/perguntas/:slug', perguntas.show)
  app.get('/perguntas/:slug/edit', auth.requiresLogin, auth.pergunta.hasAuthorization, perguntas.edit)
  app.put('/perguntas/:slug', auth.requiresLogin, auth.pergunta.hasAuthorization, perguntas.update)
  app.del('/perguntas/:slug', auth.requiresLogin, auth.pergunta.hasAuthorization, perguntas.destroy)

  app.param('slug', perguntas.pergunta)

  app.get('/', perguntas.index)

  // respostas routes
  app.post('/perguntas/:slug/respostas', respostas.create)
  app.del('/perguntas/:slug/respostas/:respergunta_id', auth.requiresLogin, auth.pergunta.hasAuthorization, respostas.destroy)

  // tag routes
  app.get('/tags/:tag', tags.filter)

  //
  app.get('/sobre', pages.about)
}