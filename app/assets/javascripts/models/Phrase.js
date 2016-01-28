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

export default class Phrase extends Document{

  constructor(data) {
    super(data);

    this.schema = {
      'id': {
        'alias': 'uid',
        'type': t.Str
      },
      'title': {
        'prefix' : 'dc',
        'type': t.Str,
        'editable': true,
        'label': 'Word'
      },
      'cultural_note': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'displayType': 'textarea',
        'label': 'Cultural Note'
      },
      'definitions': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Definitions'
      },
      'categories': {
        'prefix' : 'fv-word',
        'type': t.list(t.Object),
        'editable': true,
        'label': 'Categories'
      },
      'literal_translation': {
        'prefix' : 'fv',
        'type': t.Str,
        'editable': true,
        'label': 'Literal Translation'
      },
      'pronunciation': {
        'prefix' : 'fv-word',
        'type': t.Str,
        'editable': true,
        'label': 'Pronunciation'
      },
      'related_pictures': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Related Pictures'
      },
      'related_audio': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Related Audio'
      },
      'related_videos': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Related Videos'
      },
      'related_phrases': {
        'prefix' : 'fv-word',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Related Phrases'
      },
      'source': {
        'prefix' : 'fv',
        'type': t.list(t.Str),
        'editable': true,
        'label': 'Source'
      },
      'part_of_speech': {
        'prefix' : 'fv-word',
        'type': t.Str,
        'editable': true,
        'label': 'Part of Speech'
      },
      'private': {
        'prefix' : 'fv',
        'type': t.Bool,
        'editable': true,
        'label': 'Private'
      },
      'subjects': {
        'prefix' : 'dc',
        'type': t.Str,
        'editable': true,
        'label': 'Subjects'
      }
    }

    this.idAttribute = 'uid';
    this.initialized = false;

    if (data != undefined ) {

      this.parts_speech = {};
      this.subjects = {};

      // TODO: Experiment with changing this to "map" to avoid including underscore, see https://babeljs.io/docs/learn-es2015/#map-set-weak-map-weak-set
      _.each(this.schema, (function(fieldProps, fieldId){
        this.set(this.getFieldPrefix(fieldId), this.getFieldData(fieldId, fieldProps, data));
      }).bind(this));

      this.initialized = true;
    }    
  }

  get entityTypeName() {
    return 'FVPhrase';
  }
}