var Backbone = require('backbone');
var LanguageFamily = require('./LanguageFamily');

var LanguageFamilies = Backbone.Collection.extend({
    model: LanguageFamily
});

module.exports = LanguageFamilies;