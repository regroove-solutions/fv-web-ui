import t from 'tcomb-form';

const Dublincore = {
    'dc:title': t.String,
    'dc:description': t.maybe(t.String)
};

const FVCore = {
    'fv:definitions' : t.list(t.struct({
      'translation': t.String,
      'language': t.String
    })),
    'fv:literal_translation' : t.list(t.struct({
      'translation': t.String,
      'language': t.String
    })),
    'fv:related_pictures' : t.list(t.String),
    'fv:related_videos' : t.list(t.String),
    'fv:related_audio' : t.list(t.String),
    'fv:cultural_note' : t.list(t.String),
    'fv:available_in_childrens_archive' : t.Boolean,
    'fv:custom_order' : t.maybe(t.String),
    'fv:reference' : t.maybe(t.String),
    'fv:source' : t.list(t.String)
};

const fields = {
  FVAudio: {
  	'aud-duration' : t.Number
  },
  FVWord: Object.assign({}, Dublincore, FVCore, {
    'fv-word:categories' : t.list(t.String),
    'fv-word:pronunciation' : t.String,
    'fv-word:related_phrases' : t.list(t.String),
    'fv-word:part_of_speech' : t.String
  }),
  FVPhrase: Object.assign({}, Dublincore, FVCore, {
    'fv:literal_translation' : t.maybe(t.String),
    'fv-phrase:phrase_books' : t.list(t.String)
  }),
  FVPortal : {
    'fv-portal:about': t.String,
    'fv-portal:greeting': t.String,
    'fv-portal:featured_audio' : t.String,
    'fv-portal:featured_words' : t.list(t.String),
    'fv-portal:background_top_image' : t.String,
    'fv-portal:logo' : t.String
  },
  FVDialect: Object.assign({}, Dublincore, {
    'fvdialect:country' : t.String,
    'fvdialect:dominant_language' : t.String,
    'fvdialect:region' : t.String,
    'fvdialect:contact_information' : t.String
  })
}

export default fields;

// Sample usage with tcomb
// const FVPortal = t.struct(selectn('FVPortal', fields));