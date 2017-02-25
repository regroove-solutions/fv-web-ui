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

const fields = {
  Portals: makeOptional({
    'contextParameters.ancestry.dialect.dc:title': t.String,
    'contextParameters.portal.roles': Roles
  }),
  SharedPictures: {
    'properties.dc:title': t.String
  },
  SharedAudio: {
    'properties.dc:title': t.String
  },
  SharedVideos: {
    'properties.dc:title': t.String
  },
  Resources: makeOptional({
    'properties.dc:title': t.String,
    'properties.type': ResourceTypes,
    'common:size': MaxMB,
    'picture:info.height': t.Number,
    'picture:info.width': t.Number,
    'dc:contributors': t.String,
    'fvm:child_focused': t.Boolean,
    'fvm:origin': t.Boolean,
    'fvm:shared': t.Boolean
  }),
  Books: makeOptional({
    'properties.dc:title': t.String,
    'properties.fvbook:type': BookTypes
  })
}

export default fields;