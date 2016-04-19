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

const DefinitionsLayout = function (locals) {
  return (
    <div>
      <p>DefinitionsLayout</p>
      <div>{locals.inputs.translation}</div>
      <div>{locals.inputs.language}</div>
    </div>
  );
};

const options = {
  FVWord: {
    order: ['dc:title', 'fv:definitions', 'fv:literal_translation', 'fv-word:part_of_speech', 'fv-word:pronunciation', 'fv-word:related_phrases', 'fv-word:categories', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fv:cultural_note', 'fv:reference', 'fv:source', 'fv:available_in_childrens_archive'],
    fields: {
      'dc:title': {
        label: 'Word'
       },
      'fv:definitions': {
        label: 'Definitions',
        item: {
          //template: DefinitionsLayout
        }
      },
      'fv:literal_translation': {
        label: 'Literal Translation',
        item: {
          //template: DefinitionsLayout
        }
      },
      'fv-word:part_of_speech' : {
        label: 'Part of Speech'
      },
      'fv-word:pronunciation' : {
        label: 'Pronunciation'
      },
      'fv-word:related_phrases' : {
        label: 'Related Phrases'
      },
      'fv-word:categories' : {
        label: 'Categories'
      },
      'fv:related_audio' : {
        label: 'Related Audio',
        item: {
          factory: SelectFactory,
          type: 'audio'
        }
      },
      'fv:related_pictures' : {
        label: 'Related Pictures',
        item: {
          factory: SelectFactory,
          type: 'picture'
        }
      },
      'fv:related_videos' : {
        label: 'Related Videos',
        item: {
          factory: SelectFactory,
          type: 'video'
        }
      },
      'fv:cultural_note' : {
        label: 'Cultural Notes'
      },
      'fv:reference': {
        label: 'Reference'
      },
      'fv:source': {
        label: 'Source'
      },
      'fv:available_in_childrens_archive': {
        label: 'Available in Children\'s Archive'
      }
    }
  },
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
        label: 'Dialect Name',
        type: 'text'
      },
      'dc:description': {
        label: 'About Dialect',
        type: 'textarea',
        factory: WysiwygFactory
      },
      'fvdialect:country': {
        label: 'Country',
        factory: t.form.Select,
        options: []
      },
      'fvdialect:contact_information': {
        label: 'Contact Information',
        type: 'textarea',
        factory: WysiwygFactory
      }
    },
    i18n: i18nExt
  }
};

export default options;

// Sample usage with tcomb
//const PortalOptions = selectn('FVPortal', options);