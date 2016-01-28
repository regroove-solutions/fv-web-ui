import Document from 'models/Document';
import t from 'tcomb-form';
import _ from 'underscore';

export default class LanguageFamily extends Document {

  constructor(data) {
    super(data);

    this.idAttribute = 'uid';
    this.initialized = false;

    this.schema = {
      'id': {
        'alias': 'uid',
        'type': t.Str
      },
      'title': {
        'prefix' : 'dc',
        'type': t.Str,
        'editable': true,
        'label': 'Language Family'
      },
      'description': {
          'prefix' : 'dc',
          'type': t.Str,
          'editable': true,
          'label': 'Description'
      },
      'countries': {
          'prefix' : 'fvlanguagefamily',
          'type': t.list(t.Str),
          'editable': true,
          'label': 'Countries'
      }        
    };

    if (data != undefined ) {

      _.each(this.schema, (function(fieldProps, fieldId){
        this.set(this.getFieldPrefix(fieldId), this.getFieldData(fieldId, fieldProps, data));
      }).bind(this));

      this.initialized = true;
    }
  }

  get entityTypeName() {
    return 'FVLanguageFamily';
  }
}