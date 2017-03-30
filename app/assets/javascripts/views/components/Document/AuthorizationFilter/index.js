import React, {Component, PropTypes} from 'react';
import Immutable, { List, Map } from 'immutable';
import selectn from 'selectn';

export default class AuthorizationFilter extends Component {

  static propTypes = {
    children: PropTypes.node,
    renderPartial: PropTypes.bool,
    key: PropTypes.string
  };

  static defaultProps = {
    renderPartial: false
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props, context) {
	  super(props, context);

    // Bind methods to 'this'
    ['_renderHelper'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  /**
  * Renders partial view or nothing at all, depending on a flag
  */
  _renderHelper() {
      if (this.props.renderPartial) {
       return React.cloneElement(this.props.children, { accessDenied: true });
      }
      else {
       return null;
      }
  }

  render() {
    const {
      children,
      filter,
      ...other,
    } = this.props;

    let currentUserEntityPermissions = selectn('contextParameters.permissions', filter.entity);

    if (filter.hasOwnProperty('permission')) {
      if (!currentUserEntityPermissions || currentUserEntityPermissions.indexOf(filter.permission) === -1) {
        return this._renderHelper();
      }
    } else if (filter.hasOwnProperty('role') && filter.hasOwnProperty('login')) {

      let acls = selectn('contextParameters.acls', filter.entity);

      if (acls) {
        let combinedAces = selectn('[0].aces', acls).concat(selectn('[1].aces', acls) || []);
        let extendedUserGroups = Immutable.fromJS(selectn('response.extendedGroups', filter.login));

        if (!extendedUserGroups || extendedUserGroups.size === 0) {
          return this._renderHelper();
        }

        // Get the ACEs that match the required permissions
        let filteredAceList = Immutable.fromJS(combinedAces).filter(function(entry) {
          return filter.role.indexOf(entry.get('permission')) !== -1 && entry.get('granted') && entry.get('status') == 'effective';
        })

        // Test ACEs against user's roles
        let userHasRole = filteredAceList.findIndex(function(entry) {

          // Test each group/username against ACE
          let hasRole = extendedUserGroups.findIndex(function(extendedGroupEntry){
              return entry.get('username') == extendedGroupEntry.get('name') || entry.get('username') == selectn('response.id', filter.login);
          });

          return (hasRole === -1) ? false : true;
        });

        if (!currentUserEntityPermissions || userHasRole === -1) {
          return this._renderHelper();
        }
      } else {
        return null;
      }

    } else {
      return null;
    }

    let combinedProps = { key: this.props.key, style: Object.assign({}, this.props.style, children.props.style) };

	  return React.cloneElement(children, combinedProps);
  }
}