import t from 'tcomb-form';

const fields = {
  FVPortal : {
    'fv-portal:about': t.String,
    'fv-portal:greeting': t.String
  },
  FVDialect : {
    'dc:title': t.String
  }
}

export default fields;

// Sample usage with tcomb
// const FVPortal = t.struct(selectn('FVPortal', fields));