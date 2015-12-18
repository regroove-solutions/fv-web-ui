var Backbone = require('backbone');
var Language = require('./Language');

var Languages = Backbone.Collection.extend({
    model: Language
});

module.exports = Languages;