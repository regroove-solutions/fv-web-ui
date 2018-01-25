/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';

import classNames from 'classnames';
import provide from 'react-redux-provide';
import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

import ProviderHelpers from 'common/ProviderHelpers';
import NavigationHelpers from 'common/NavigationHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import Header from 'views/pages/explore/dialect/header';
import PageToolbar from 'views/pages/explore/dialect/page-toolbar';

import Toggle from 'material-ui/lib/toggle';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';

import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';
import Snackbar from 'material-ui/lib/snackbar';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';

import ListUI from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import Preview from 'views/components/Editor/Preview';

import GridView from 'views/pages/explore/dialect/learn/base/grid-view';

const defaultStyle = {width: '100%', overflowY: 'auto', marginBottom: 24};

import EditableComponent, {EditableComponentHelper} from 'views/components/Editor/EditableComponent';

import Link from 'views/components/Document/Link';
import TextHeader from 'views/components/Document/Typography/text-header';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

/**
* Dialect portal page showing all the various components of this dialect.
*/
@provide
export default class ServiceShortURL extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,
    queryDialect2: PropTypes.func.isRequired,
    computeDialect2Query: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.fetchData(this.props);
  }

  fetchData(newProps) {
    newProps.queryDialect2('/FV/' + newProps.routeParams.area, ' AND ecm:name = \'' + newProps.routeParams.dialectFriendlyName + '\'');
  }

  componentDidUpdate() {
    const dialectQuery = ProviderHelpers.getEntry(this.props.computeDialect2Query, '/FV/' + this.props.routeParams.area);
    const isSection = this.props.routeParams.area === 'sections';

    let dialectFullPath = selectn('response.entries[0].path', dialectQuery);

    if (dialectFullPath) {
      window.location.replace('/explore' + dialectFullPath);
    }
  }

  render() { return null; }
};