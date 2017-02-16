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

const MaxMB = t.refinement(t.Number, (n) => {return n <= 2000});

const fields = {
  Portals: makeOptional({
    'contextParameters.ancestry.dialect.dc:title': t.String,
    'contextParameters.portal.roles': Roles
  }),
  SharedPictures: {
    'properties.dc:title': t.String,
    'common:size': MaxMB
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
    'dc:contributors': t.String,
    'fvm:child_focused': t.Boolean,
    'fvm:shared': t.Boolean
  })
}

export default fields;