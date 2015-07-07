var Backbone = require('backbone');
var Word = require('./Word');

var Words = Backbone.Collection.extend({
    model: Word
});

module.exports = Words;