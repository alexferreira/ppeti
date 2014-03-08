
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , friendly = require('mongoose-friendly');

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Pergunta Schema
 */

var PerguntaSchema = new Schema({
  title: {type : String, default : '', trim : true},
  type_question: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  respostas: [{
    email: {type : String, default : '', trim : true},
    body: { type : String, default : '' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now},
  updateAt  : {type : Date, default : Date.now}
});

/**
 * Plugins
 */

PerguntaSchema.plugin(friendly)

/**
 * Validations
 */

PerguntaSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Pergunta title cannot be blank');

/**
 * Methods
 */

PerguntaSchema.methods = {

  /**
   * Add resposta
   *
   * @param {User} user
   * @param {Object} resposta
   * @param {Function} cb
   * @api private
   */

  addResposta: function (resposta, cb) {
    this.respostas.push({
      email: resposta.email,
      body: resposta.body
    })

    this.save(cb)
  },

  /**
   * Del resposta
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  delResposta: function (id, cb) {
    this.respostas = this.respostas.filter(function(el) { return el._id != id; });

    this.save(cb)
  }

}

mongoose.model('Pergunta', PerguntaSchema)
