
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Pergunta = mongoose.model('Pergunta')
  , _ = require('underscore')

/**
 * List of Perguntas
 */

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 10
  var options = {
    perPage: perPage,
    page: page
  }
  var regex = new RegExp(req.query.q, 'i');
  var search = req.query.q ? {title: regex}: {}

  var q = req.query.q ? req.query.q.replace('+', ' ') : false
  Pergunta
    .find(search)
    .populate('user', 'email')
    .sort({'updateAt': -1}) // sort by date
    .limit(options.perPage)
    .skip(options.perPage * options.page)
    .exec(function(err, perguntas) {
      if (err) return res.render('500')
      Pergunta.count().exec(function (err, count) {
        res.render('perguntas/index', {
          title: 'Lista de Perguntas',
          perguntas: perguntas,
          tags: req.tags,
          user: req.user,
          isAuthenticated: req.isAuthenticated(),
          page: page,
          q: q,
          pages: count / perPage,
        })
      })
    })
}

/**
 * View an pergunta
 */

exports.show = function(req, res){
  res.render('perguntas/show', {
    title: req.pergunta.title,
    pergunta: req.pergunta,
    tags: req.tags,
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
    messages: req.flash('error')
  })
}

/**
 * Find pergunta by id
 */

exports.pergunta = function(req, res, next, id){
  var User = mongoose.model('User')

  Pergunta.findById(id).populate('user', 'email').exec(function (err, pergunta) {
    if (err) return next(err)
    if (!pergunta) return next(new Error('Failed to load pergunta ' + id))
    req.pergunta = pergunta
    next()
  })
}

/**
 * New pergunta
 */

exports.new = function(req, res){
  res.render('perguntas/new', {
    title: 'Novo Pergunta',
    pergunta: new Pergunta({}),
    tags: req.tags
  })
}

/**
 * Create an pergunta
 */

exports.create = function (req, res) {
  var pergunta = new Pergunta(req.body)
  pergunta.user = req.user

  pergunta.save(function (err) {
    if (err) {
      res.render('perguntas/new', {
        title: 'Novo Pergunta',
        pergunta: pergunta,
        errors: err.errors
      })
    } else {
      res.redirect('/perguntas/'+pergunta._id)
    }
  })
}

/**
 * Edit an pergunta
 */

exports.edit = function (req, res) {
  res.render('perguntas/edit', {
    title: 'Editando '+req.pergunta.title,
    pergunta: req.pergunta,
    tags: req.tags
  })
}

/**
 * Update pergunta
 */

exports.update = function(req, res){
  var pergunta = req.pergunta
  pergunta = _.extend(pergunta, req.body)
  pergunta.updateAt = Date.now();
  pergunta.save(function (err) {
    if (err) {
      res.render('perguntas/edit', {
        title: 'Editando Pergunta',
        pergunta: pergunta,
        errors: err.errors
      })
    } else {
      res.redirect('/perguntas/'+pergunta._id)
    }
  })
}

/**
 * Delete an pergunta
 */

exports.destroy = function(req, res){
  var pergunta = req.pergunta
  pergunta.remove(function(err){
    req.flash('notice', 'Pergunta deletado com sucesso')
    res.redirect('/perguntas')
  })
}
