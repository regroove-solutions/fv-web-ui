var Backbone = require('backbone');
var Dialect = require('./Dialect');

var Dialects = Backbone.Collection.extend({
    model: Dialect
});

module.exports = Dialects;