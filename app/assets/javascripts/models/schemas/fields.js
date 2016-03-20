import t from 'tcomb-form';

const audioSubtype = {x: t.Number, y: t.Number};

const fields = {
  FVAudio: {
  	'aud-duration' : t.Number
  },
  FVPortal : {
    'fv-portal:about': t.String,
    'fv-portal:greeting': t.String,
    'fv-portal:featured_audio' : t.String,
    'fv-portal:featured_words' : t.list(t.String),
    'fv-portal:background_top_image' : t.String,
    'fv-portal:logo' : t.String,
    'fv-portal:greeting' : t.String
  },
  FVDialect : {
    'dc:title': t.String,
    'dc:description': t.String,
    'country' : t.String,
    'dominant_language' : t.String,
    'region' : t.String
  }
}

export default fields;

// Sample usage with tcomb
// const FVPortal = t.struct(selectn('FVPortal', fields));