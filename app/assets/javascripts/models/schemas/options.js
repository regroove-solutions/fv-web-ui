import React from 'react';
import t from 'tcomb-form';

import VirtualKeyboardFactory from 'views/components/Editor/fields/virtualKeyboard';

import WysiwygFactory from 'views/components/Editor/fields/wysiwyg';
import SelectSuggestFactory from 'views/components/Editor/fields/selectSuggest';
import SelectFactory from 'views/components/Editor/fields/select';
import MediaFactory from 'views/components/Editor/fields/media';

const i18nExt = {
  add: '+ Add',
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
    <div className="table-responsive">
      <table className="table">
        <tbody>
        <tr>
          <td>{locals.inputs.language}</td>
          <td>{locals.inputs.translation}</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

t.String.getValidationErrorMessage = (value, path, context) => {
  if (!value) {
    return 'Value in field ' + context.options.label + ' cannot be empty.';
  }
};

const options = {
  FVWord: {
    order: ['dc:title', 'fv-word:part_of_speech', 'fv-word:pronunciation', 'fv:definitions', 'fv:literal_translation', 'fv-word:related_phrases', 'fv-word:categories', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fv:cultural_note', 'fv:reference', 'fv:source', 'fv:available_in_childrens_archive'],
    fields: {
      'dc:title': {
        label: 'Word',
        factory: VirtualKeyboardFactory
       },
      'fv:definitions': {
        label: 'Definitions',
        item: {
          fields: {
            translation: {
              label: 'Translation',
              factory: VirtualKeyboardFactory
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Describe what the word actually means.</i>
      },
      'fv:literal_translation': {
        label: 'Literal Translation',
        item: {
          fields: {
            translation: {
              label: 'Translation',
              factory: VirtualKeyboardFactory
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Describe what the word translates to regardless of context.</i>
      },
      'fv-word:part_of_speech' : {
        label: 'Part of Speech',
        factory: SelectFactory,
        attrs: {
          directory: 'parts_of_speech'
        }
      },
      'fv-word:pronunciation' : {
        label: 'Pronunciation',
        factory: VirtualKeyboardFactory
      },
      'fv-word:related_phrases' : {
        label: 'Related Phrases',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVPhrase'
        }
      },
      'fv-word:categories' : {
        label: 'Categories',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVCategory',
          attrs: {
            page_provider: {
              name: 'category_suggestion',
              folder: 'Categories'
            },
            hideCreate: true
          }
        }
      },
      'fv:related_audio' : {
        label: 'Related Audio',
        item: {
          factory: MediaFactory,
          type: 'FVAudio'
        }
      },
      'fv:related_pictures' : {
        label: 'Related Pictures',
        item: {
          factory: MediaFactory,
          type: 'FVPicture'
        }
      },
      'fv:related_videos' : {
        label: 'Related Videos',
        item: {
          factory: MediaFactory,
          type: 'FVVideo'
        }
      },
      'fv:cultural_note' : {
        label: 'Cultural Note',
        item: {
          factory: VirtualKeyboardFactory,
          type: 'FVVideo'
        }
      },
      'fv:reference': {
        label: 'Reference',
        help: <i>Origin of record (person, book, etc).</i>,
        factory: VirtualKeyboardFactory
      },
      'fv:source': {
        label: 'Source',
        help: <i>Contributor(s) who helped create this record.</i>,
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor'
        }
      },
      'fv:available_in_childrens_archive': {
        label: 'Available in Children\'s Archive'
      }
    },
    i18n: i18nExt
  },
  FVPhrase: {
    order: ['dc:title', 'fv:definitions', 'fv-phrase:phrase_books', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fv:cultural_note', 'fv:reference', 'fv:source', 'fv:available_in_childrens_archive'],
    fields: {
      'dc:title': {
        label: 'Phrase'
       },
      'fv:definitions': {
        label: 'Definitions',
        item: {
          fields: {
            translation: {
              label: 'Translation'
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Describe what the word actually means.</i>
      },
      'fv-phrase:phrase_books' : {
        label: 'Phrase Books',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVCategory',
          attrs: {
            page_provider: {
              name: 'phrasebook_suggestion',
              folder: 'Phrase Books'
            }
          }
        }
      },
      'fv:related_audio' : {
        label: 'Related Audio',
        item: {
          factory: MediaFactory,
          type: 'FVAudio'
        }
      },
      'fv:related_pictures' : {
        label: 'Related Pictures',
        item: {
          factory: MediaFactory,
          type: 'FVPicture'
        }
      },
      'fv:related_videos' : {
        label: 'Related Videos',
        item: {
          factory: MediaFactory,
          type: 'FVVideo'
        }
      },
      'fv:cultural_note' : {
        label: 'Cultural Notes'
      },
      'fv:reference': {
        label: 'Reference',
        help: <i>Origin of record (person, book, etc).</i>
      },
      'fv:source': {
        label: 'Source',
        help: <i>Contributor(s) who helped create this record.</i>,
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor'
        }
      },
      'fv:available_in_childrens_archive': {
        label: 'Available in Children\'s Archive'
      }
    },
    i18n: i18nExt
  },
  FVBook: {
    order: ['dc:title', 'fvbook:title_literal_translation', 'fvbook:introduction', 'fvbook:introduction_literal_translation', 'fvbook:type', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fvbook:author', 'fv:cultural_note', 'fv:source', 'fv:available_in_childrens_archive'],
    fields: {
      'dc:title': {
        label: 'Book Title',
        help: <i>The title of the song or story</i>
       },
      'fvbook:title_literal_translation': {
        label: 'Book Title Translation',
        item: {
          fields: {
            translation: {
              label: 'Translation'
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Describe what the word translates to regardless of context.</i>
      },
      'fvbook:introduction': {
        label: 'Book Introduction',
        type: 'textarea',
        attrs: {
          placeholder: 'Enter book introduction here'
        }
      },
      'fvbook:introduction_literal_translation': {
        label: 'Introduction Translation',
        item: {
          fields: {
            translation: {
              label: 'Translation',
              type: 'textarea'
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Describe what the word translates to regardless of context.</i>
      },
      'fvbook:type': {
        label: 'Type',
        factory: SelectFactory,
        attrs: {
          directory: 'fv_book_type'
        }
      },
      'fv:related_audio' : {
        label: 'Related Audio',
        item: {
          factory: MediaFactory,
          type: 'FVAudio'
        }
      },
      'fv:related_pictures' : {
        label: 'Related Pictures',
        item: {
          factory: MediaFactory,
          type: 'FVPicture'
        }
      },
      'fv:related_videos' : {
        label: 'Related Videos',
        item: {
          factory: MediaFactory,
          type: 'FVVideo'
        }
      },
      'fvbook:author': {
        label: 'Author',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor'
        }
      },
      'fv:source': {
        label: 'Source',
        help: <i>Contributor(s) who helped create this record.</i>,
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor'
        }
      },
      'fv:cultural_note' : {
        label: 'Cultural Notes'
      },
      'fv:available_in_childrens_archive': {
        label: 'Available in Children\'s Archive'
      }      
    },
    i18n: i18nExt
  },
  FVBookEntry: {
    order: ['dc:title', 'fvbookentry:dominant_language_text', 'fv:literal_translation', 'fv:related_audio', 'fv:related_pictures', 'fv:related_videos', 'fv:cultural_note', 'fv:source'],
    fields: {
      'dc:title': {
        label: 'Page Content',
        type: 'textarea',
        factory: WysiwygFactory
       },
      'fvbookentry:dominant_language_text': {
        label: 'Dominant Language Text',
        item: {
          fields: {
            translation: {
              label: 'Translation',
              type: 'textarea'
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Page content translation.</i>
      },
      'fv:literal_translation': {
        label: 'Literal Translation',
        item: {
          fields: {
            translation: {
              label: 'Translation',
              type: 'textarea'
            },
            language: {
              label: 'Language',
              factory: SelectFactory,
              attrs: {
                defaultValue: 'english',
                directory: 'fv_language'
              }
            }
          },
          template: DefinitionsLayout
        },
        help: <i>Describe what the book entry translates to regardless of context.</i>
      },
      'fv:related_audio' : {
        label: 'Related Audio',
        item: {
          factory: MediaFactory,
          type: 'FVAudio'
        }
      },
      'fv:related_pictures' : {
        label: 'Related Pictures',
        item: {
          factory: MediaFactory,
          type: 'FVPicture'
        }
      },
      'fv:related_videos' : {
        label: 'Related Videos',
        item: {
          factory: MediaFactory,
          type: 'FVVideo'
        }
      },
      'fv:source': {
        label: 'Source',
        help: <i>Contributor(s) who helped create this record.</i>,
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor'
        }
      },
      'fv:cultural_note' : {
        label: 'Cultural Notes'
      }
    },
    i18n: i18nExt
  },
  FVGallery: {
    order: ['dc:title', 'dc:description', 'fv:related_pictures'],
    fields: {
      'dc:title': {
        label: 'Gallery Name',
        help: <i>The name of the gallery</i>
       },

      'dc:description': {
        label: 'Gallery Description',
        type: 'textarea',
        attrs: {
          placeholder: 'Enter gallery description here'
        }
      },
      'fv:related_pictures' : {
        label: 'Related Pictures',
        item: {
          factory: MediaFactory,
          type: 'FVPicture'
        }
      }    
    },
    i18n: i18nExt
  },  
  
  FVCategory: {
    order: ['dc:title', 'dc:description', 'fvcategory:parent_category', 'fvcategory:image'],
    fields: {
      'dc:title': {
        label: 'Category Name',
        help: <i>The name of the category</i>
       },

      'dc:description': {
        label: 'Category Description',
        type: 'textarea',
        attrs: {
          placeholder: 'Enter category description here'
        }
      },
      'fvcategory:parent_category': {
          label: 'Parent Category Name',
          help: <i>The name of the parent category</i>,
          factory: SelectSuggestFactory,
          type: 'FVCategory',
          attrs: {
            page_provider: {
              name: 'category_suggestion',
              folder: 'Categories'
            },
            disableCreateNewButton: true
          }          
       },      
      'fvcategory:image' : {
        label: 'Category Image',
        factory: MediaFactory,
        type: 'FVPicture'
      }    
    },
    i18n: i18nExt
  }, 

  FVPhraseBook: {
    order: ['dc:title', 'dc:description'],
    fields: {
      'dc:title': {
        label: 'Phrase Book Name',
        help: <i>The name of the phrase book</i>
       },

      'dc:description': {
        label: 'Phrase Book Description',
        type: 'textarea',
        attrs: {
          placeholder: 'Enter phrase book description here'
        }
      }
    },
    i18n: i18nExt
  },   
  
  FVContributor: {
    order: ['dc:title', 'dc:description'],
    fields: {
      'dc:title': {
        label: 'Contributor Name',
        help: <i>The name of the contributor</i>
       },

      'dc:description': {
        label: 'Contributor Description',
        type: 'textarea',
        attrs: {
          placeholder: 'Enter contributor description here'
        }
      }   
    },
    i18n: i18nExt
  }, 
  
  FVPortal: {
    fields: {
      'fv-portal:greeting': {
        label: 'Portal Greeting'
      },
      'fv-portal:about': {
        label: 'Portal Introduction',
        type: 'textarea',
        factory: WysiwygFactory,
        attrs: {
          placeholder: 'Enter portal description here'
        }
      },
      'fv-portal:featured_audio' : {
        label: 'Featured Audio',
        factory: MediaFactory,
        type: 'FVAudio'
      },
      'fv-portal:featured_words' : {
        label: 'Featured Words',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVWord',
          attrs: {
            disableCreateNewButton: true
          }
        }
      },
      'fv-portal:background_top_image' : {
        label: 'Background Image',
        factory: MediaFactory,
        type: 'FVPicture'
      },
      'fv-portal:logo' : {
        label: 'Logo',
        factory: MediaFactory,
        type: 'FVPicture'
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
        factory: SelectFactory,
        attrs: {
          fancy: false,
          directory: 'fv_countries'
        }
      },
      'fvdialect:dominant_language': {
        label: 'Dominant Language',
        factory: SelectFactory,
        attrs: {
          fancy: false,
          directory: 'fv_language'
        }
      },
      'fvdialect:region': {
        label: 'Region',
        type: 'text'
      },
      'fvdialect:contact_information': {
        label: 'Contact Information',
        type: 'textarea',
        factory: WysiwygFactory
      }
    },
    i18n: i18nExt
  },

  FVCharacter: {
    fields: {
      'dc:title': {
        label: 'Character',
        disabled: true
       },
      'fvcharacter:upper_case_character': {
        label: 'Upper Case',
        disabled: true
       },
      'fvcharacter:alphabet_order': {
        label: 'Sort Order',
        disabled: true
       },
      'fv:related_audio' : {
        label: 'Related Audio',
        item: {
          factory: MediaFactory,
          type: 'FVAudio'
        }
      },
      'fvcharacter:related_words' : {
        label: 'Featured Words',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVWord',
          attrs: {
            disableCreateNewButton: true
          }
        }
      }
    },
    i18n: i18nExt
  },

  FVResource: {
    order: ['dc:title', 'dc:description', 'file', 'fvm:shared', 'fvm:child_focused', 'fvm:source', 'fvm:recorder'],
    fields: {
      'dc:title': {
        label: 'Name',
        type: 'text'
      },
      'dc:description': {
        label: 'Description',
        type: 'textarea'
      },
      'file': {
        label: 'File',
        type: 'file'
      },
      'fvm:shared': {
        label: 'Share across dialects?'
      },
      'fvm:child_focused': {
        label: 'Child focused'
      },
      'fvm:source': {
        label: 'Source',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor'
        }
      },
      'fvm:recorder': {
        label: 'Recorder',
        item: {
          factory: SelectSuggestFactory,
          type: 'FVContributor'
        }
      }
    },
    config: {
      horizontal: {
        md: [3, 9],
        sm: [6, 6]
      }
    },
    i18n: i18nExt
  }
};

export default options;