import t from 'tcomb-form';

function makeOptional(schema){
  return Object.keys(schema).reduce((p, c) => ({...p, ...{[c]: t.maybe(schema[c])}}), {});
}

const Roles = t.enums({
  Anything: 'Any Role',
  Record: 'Recorder',
  Approve: 'Approver',
  Manage: 'Admin',
  Member: 'Member'
});

const ResourceTypes = t.enums({
  FVPicture: 'Pictures',
  FVAudio: 'Audio',
  FVVideo: 'Videos'
});

const BookTypes = t.enums({
  song: 'Song Book',
  story: 'Story Book'
});

const MaxMB = t.refinement(t.Number, (n) => {return n <= 2000});

const ResourcesFields = {
    'properties.dc:title': t.String,
    'properties.type': ResourceTypes,
    'common:size': MaxMB,
    'picture:info.height': t.Number,
    'picture:info.width': t.Number,
    'dc:contributors': t.String,
    'fvm:child_focused': t.Boolean,
    'fvm:origin': t.Boolean,
    'fvm:shared': t.Boolean
  };

let ResourcesSelectorFields = Object.assign({}, ResourcesFields, {
  'shared_fv': t.Boolean,
  'shared_dialects': t.Boolean
});

delete ResourcesSelectorFields['properties.type'];
delete ResourcesSelectorFields['fvm:shared'];
delete ResourcesSelectorFields['fvm:origin'];

const fields = {
  Default: {
    'properties.dc:title': t.String
  },
  Portals: makeOptional({
    'contextParameters.ancestry.dialect.dc:title': t.String,
    'contextParameters.portal.roles': Roles
  }),
  ResourcesSelector: makeOptional(ResourcesSelectorFields),
  Resources: makeOptional(ResourcesFields),
  Books: makeOptional({
    'properties.dc:title': t.String,
    'properties.fvbook:type': BookTypes
  }),
  User: makeOptional({
    'searchTerm': t.String,
    'group': t.String
  }),
  Search: {
    'searchTerm': t.String,
    'documentTypes': t.maybe(t.list(t.enums({
      'FVWord': 'Words',
      'FVPhrase': 'Phrases',
      'FVPortal': 'Dialects',
      'FVBook': 'Song/Story Books'
    })))
  }
}

export default fields;