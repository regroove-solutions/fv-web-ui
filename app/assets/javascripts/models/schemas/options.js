import React from 'react';
import WysiwygFactory from 'views/components/Editor/fields/wysiwyg';

const options = {
  FVPortal: {
    fields: {
      'fv-portal:about': {
        label: <i>Portal Introduction</i>,
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          placeholder: 'Enter portal description here'
        }
      }
    }
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
    }
  }
};

export default options;

// Sample usage with tcomb
//const PortalOptions = selectn('FVPortal', options);