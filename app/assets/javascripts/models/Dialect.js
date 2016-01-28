/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import Document from 'models/Document';
import t from 'tcomb-form';
import _ from 'underscore';

export default class Dialect extends Document {

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
        'label': 'Dialect'
      },
      'description': {
          'prefix' : 'dc',
          'type': t.Str,
          'editable': true,
          'label': 'Description'
      },
      'country': {
          'prefix' : 'fvdialect',
          'type': t.Str,
          'editable': true,
          'label': 'Country'
      },
      'region': {
          'prefix' : 'fvdialect',
          'type': t.Str,
          'editable': true,
          'label': 'Region'
      },
      'dominant_language': {
          'prefix' : 'fvdialect',
          'type': t.Str,
          'editable': true,
          'label': 'Dominant Language'
      },
      'language': {
          'prefix' : 'fva',
          'type': t.Str,
          'editable': false,
          'label': 'Parent Language'
      },
      'family': {
          'prefix' : 'fva',
          'type': t.Str,
          'editable': false,
          'label': 'Parent Family'
      }
    };

    if (data != undefined ) {

      _.each(this.schema, (function(fieldProps, fieldId){
        this.set(this.getFieldPrefix(fieldId), this.getFieldData(fieldId, fieldProps, data));
      }).bind(this));

      // TODO: Convert language family and language to model objects

      // If the enricher exists, set relevant objects
      if (data.contextParameters && data.contextParameters.firstvoices) {

        // Set language family context parameters
        if (data.contextParameters.firstvoices.family)
          this.set('parentLanguageFamily', data.contextParameters.firstvoices.family);

        // Set language context parameters
        if (data.contextParameters.firstvoices.language)
          this.set('parentLanguage', data.contextParameters.firstvoices.language);

      }

      this.initialized = true;
    }
  }

  getTest(){
    return 'test';
  }

  get entityTypeName() {
    return 'FVDialect';
  }
}