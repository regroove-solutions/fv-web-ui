import React from 'react';
import t from 'tcomb-form';
import WysiwygFactory from 'views/components/Editor/fields/wysiwyg';
import SelectFactory from 'views/components/Editor/fields/select';

const i18nExt = {
  add: 'New Item',
  down: '▼',
  remove: 'X',
  up: '▲',
  optional: '(optional)'
}

const configExt = {
  config: {
    // for each of lg md sm xs you can specify the columns width
    horizontal: {
      md: [3, 9],
      sm: [6, 6]
    }
  }
}

const options = {
  FVPortal: {
    fields: {
      'fv-portal:about': {
        label: 'Portal Introduction',
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          placeholder: 'Enter portal description here'
        }
      },
      'fv-portal:greeting': {
        label: 'Portal Greeting'
      },
      'fv-portal:featured_audio' : {
        label: 'Featured Audio',
        item: {
          factory: SelectFactory,
          type: 'audio'
        }
      },
      'fv-portal:featured_words' : {
        label: 'Featured Words'
      },
      'fv-portal:background_top_image' : {
        label: 'Background Image'
      },
      'fv-portal:logo' : {
        label: 'Logo'
      }
    },
    i18n: i18nExt
  },
  FVDialect: {
    fields: {
      'dc:title': {
        label: <i>Portal Introduction</i>,
        type: 'text',
        attrs: {
          placeholder: 'Enter portal description here'
        }
      },
      'dc:description': {
        label: <i>Portal Introduction</i>,
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          placeholder: 'Enter portal description here'
        }
      }
    },
    i18n: i18nExt
  }
};

export default options;

// Sample usage with tcomb
//const PortalOptions = selectn('FVPortal', options);