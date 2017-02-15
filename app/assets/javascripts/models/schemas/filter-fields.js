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
  }
}

export default fields;