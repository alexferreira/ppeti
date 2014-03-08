
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

/**
 * Create resposta
 */

exports.create = function (req, res) {
  var pergunta = req.pergunta;
  if (!req.body.body) {
    if(!req.body.body) req.flash('error', 'O Comentário deve ser preenchido')
    return res.redirect('/perguntas/'+ pergunta.id)
  }
  req.body.email = req.user.email;
  pergunta.addResposta(req.body, function (err) {
    if (err) return res.render('500')
    res.redirect('/perguntas/'+ pergunta.id)
  })
}

/**
 * Delete an resposta
 */

exports.destroy = function(req, res){
  var pergunta = req.pergunta

  pergunta.delResposta(req.params.resposta_id, function (err) {
    if (err) return res.render('500')
    res.redirect('/perguntas/'+ pergunta.id)
  })
}