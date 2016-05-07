import React, {Component, PropTypes} from 'react';
import selectn from 'selectn';

export default class AuthorizationFilter extends Component {

  static propTypes = {
    children: PropTypes.node
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

    if (currentUserEntityPermissions && currentUserEntityPermissions.indexOf(filter.permission) === -1) {
    	return null;
    }

    let combinedStyle = { style: Object.assign({}, this.props.style, children.props.style) };

	  return React.cloneElement(children, combinedStyle);
  }
}