import t from 'tcomb-form';

import classNames from 'classnames';

import ValuedCheckboxFactory from 'views/components/Editor/fields/valued-checkbox';
import RangeSelector from 'views/components/Editor/fields/range';
import SelectFactory from 'views/components/Editor/fields/select';

import { FlatButton, IconButton } from 'material-ui';

import ProviderHelpers from 'common/ProviderHelpers';

const i18nExt = {
  add: '+ Add New',
  down: '▼',
  remove: 'X',
  up: '▲',
  optional: '(optional)'
}

const SearchDocumentTypesTemplate = function (locals) {

  return (
    <div className="row" style={{margin: '15px 0'}}>
    <fieldset>
      <legend>{locals.label} {(locals.items.length < 4) ? <FlatButton label={locals.add.label} onTouchTap={locals.add.click} /> : ''}</legend>
        {(locals.items || []).map(function(item, i) {
          return <div key={i} className={classNames('col-xs-12')}>
                    <div style={{width: '60%', display: 'inline-block'}}>{item.input}</div>
                    <div style={{width: '40%', display: 'inline-block'}}>{item.buttons.map((button, i) => {
                      if (button.type == 'remove') {
                        return <IconButton tooltip='Remove Item' iconClassName="material-icons" key={i} onClick={button.click}>clear</IconButton>;
                      }
                    })}</div>
                </div>;
        })}
    </fieldset>
    </div>
  );
};

let ResourcesFields = {
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
  };

const options = {
  Default: {
    fields: {
      'properties.dc:title': {
        label: 'Title',
        nxql: ' (dc:title ILIKE \'%${value}%\' OR dc:description ILIKE \'%${value}%\')'
      },
    }
  },
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
  ResourcesSelector: {
    fields: Object.assign({}, ResourcesFields.fields, {
      'shared_fv': {
        label: 'Include Shared from FirstVoices',
        nxql: ' (ecm:path STARTSWITH \'/FV/Workspaces/SharedData/Shared%20Resources/\')',
        operator: 'OR'
        //nxqlGroup: 'search_group1'
      },
      'shared_dialects': {
        label: 'Include Shared from Other Dialects',
        nxql: ' (fvm:shared = 1 AND ecm:currentLifeCycleState != \'New\')',
        operator: 'OR'
        //nxqlGroup: 'search_group1'
      }
    })
  },
  Resources: ResourcesFields,
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
  },
  User: {
    fields: {
      'searchTerm': {
        label: 'Search Term'
      },
      'group': {
        label: 'Group(s)',
        help: 'Group identifiers (For example: "sample_dialect_recorders")'
      }
    }
  },
  Reports: {
    fields: {
      'name': {
        label: 'Report Name'
      },
      'type': {
        label: 'Show Report on:',
        factory: t.form.Select
      }
    }
  },
  Search: {
    fields: {
      'searchTerm': {
        label: 'Search Term',
        attrs: {
          autoFocus: true
        }
      },
      'documentTypes': {
        label: 'Document Types',
        template: SearchDocumentTypesTemplate
      }
    },
    i18n: i18nExt
  }
};

export default options;