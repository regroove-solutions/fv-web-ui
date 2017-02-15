import t from 'tcomb-form';

import ProviderHelpers from 'common/ProviderHelpers';
import SelectSuggestFactory from 'views/components/Editor/fields/selectSuggest';

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
  }
};

export default options;