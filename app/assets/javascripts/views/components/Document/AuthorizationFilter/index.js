import React, {Component, PropTypes} from 'react';
import Immutable, { List, Map } from 'immutable';
import selectn from 'selectn';

export default class AuthorizationFilter extends Component {

  static propTypes = {
    children: PropTypes.node,
    renderPartial: PropTypes.bool
  };

  static defaultProps = {
    renderPartial: false
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props, context) {
	  super(props, context);
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
        if (this.props.renderPartial) {
      	 return React.cloneElement(children, { accessDenied: true });
        }
        else {
         return null;
        }
      }
    } else if (filter.hasOwnProperty('role') && filter.hasOwnProperty('login')) {

      let acls = selectn('contextParameters.acls', filter.entity);

      if (acls) {
        let combinedAces = Object.assign(selectn('[0].aces', acls), selectn('[1].aces', acls));

        let filteredAceList = Immutable.fromJS(combinedAces).filter(function(entry) {
          return entry.get('permission') == filter.role && entry.get('granted') && entry.get('status') == 'effective';
        })

        let userHasRole = filteredAceList.findIndex(function(entry){

          let extendedUserGroups = Immutable.fromJS(selectn('response.extendedGroups', filter.login));

          if (!extendedUserGroups || extendedUserGroups.size === 0) {
            return false;
          }

          let hasRole = extendedUserGroups.findIndex(function(extendedGroupEntry){
              return entry.get('username') == extendedGroupEntry.get('name') || entry.get('username') == selectn('response.id', filter.login);
          });

          return (hasRole === -1) ? false : true;
        });

        if (!currentUserEntityPermissions || userHasRole === -1) {
          if (this.props.renderPartial) {
           return React.cloneElement(children, { accessDenied: true });
          }
          else {
           return null;
          }
        }
      } else {
        return null;
      }

    } else {
      return null;
    }

    let combinedStyle = { style: Object.assign({}, this.props.style, children.props.style) };

	  return React.cloneElement(children, combinedStyle);
  }
}