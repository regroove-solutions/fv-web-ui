import t from 'tcomb-form';
import ValuedCheckboxFactory from 'views/components/Editor/fields/valued-checkbox';
import RangeSelector from 'views/components/Editor/fields/range';

import ProviderHelpers from 'common/ProviderHelpers';

const options = {
  Portals: {
    fields: {
      'contextParameters.ancestry.dialect.dc:title': {
        label: 'Dialect Name'
      },
      'contextParameters.portal.roles': {
        label: 'My Roles',
        factory: t.form.Select,
        filterFunc: function(propertyToSearch, filterValue) {
            if (!propertyToSearch)
                return true;

            return !(propertyToSearch.findIndex(function (value, index, array) {
                if (filterValue == 'Anything') {
                    return ProviderHelpers.isActiveRole(value);
                } else {
                    return value.search(new RegExp(filterValue, "i")) === -1 ? false : true
                }
            }) === -1)
        }
      }
    }
  },
  SharedPictures: {
    fields: {
      'properties.dc:title': {
        label: 'Name'
      }
    }
  },
  SharedAudio: {
    fields: {
      'properties.dc:title': {
        label: 'Name'
      }
    }
  },
  SharedVideos: {
    fields: {
      'properties.dc:title': {
        label: 'Name'
      }
    }
  },
  Resources: {
    fields: {
      'properties.dc:title': {
        label: 'Name/Description',
        nxql: ' (dc:title ILIKE \'%${value}%\' OR dc:description ILIKE \'%${value}%\')'
      },
      'properties.type': {
        label: 'Resource Type',
        factory: t.form.Select,
        nxql: ' ecm:primaryType ILIKE \'${value}\''
      },
      'common:size': {
        label: 'Greater than (MB)',
        nxql: ' common:size > ${value} * 1024 * 1024'
      },
      'picture:info.height': {
        label: 'Height Greater Than:',
        nxql: ' picture:info/height > ${value}',
        factory: RangeSelector
      },
      'picture:info.width': {
        label: 'Width Greater Than:',
        nxql: ' picture:info/width > ${value}',
        factory: RangeSelector
      },
      'dc:contributors': {
        label: 'My Uploads/Contributions',
        nxql: ' dc:contributors IN (\'${value}\')',
        factory: ValuedCheckboxFactory
      },
      'fvm:origin': {
        label: 'Attached to a Word/Phrase',
        nxql: ' (fvm:origin IS NOT NULL AND fvm:origin <> \'\')'
      },
      'fvm:child_focused': {
        label: 'Child Focused',
        nxql: ' fvm:child_focused = ${value}'
      },
      'fvm:shared': {
        label: 'Shared',
        nxql: ' fvm:shared = ${value}'
      }
    }
  },
  Books: {
    fields: {
      'properties.dc:title': {
        label: 'Title'
      },
      'properties.fvbook:type': {
        label: 'Resource Type',
        factory: t.form.Select
      }
    }
  }
};

export default options;