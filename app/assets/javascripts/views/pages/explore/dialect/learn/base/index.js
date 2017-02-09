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
import classNames from 'classnames';

import selectn from 'selectn';
import ProviderHelpers from 'common/ProviderHelpers';

const innerUlStyle = {
    'fontSize': '0.9em',
    'margin': 0,
    'padding': '0 15px'
};

/**
* Learn Base Page
* TODO: Convert to composition vs. inheritance https://facebook.github.io/react/docs/composition-vs-inheritance.html
*/
export default class PageDialectLearnBase extends Component {

  constructor(props, context) {
    super(props, context);
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath.replace('sections', 'Workspaces') + '/' + path);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps);
    }
  }

  _handleFacetSelected(facetField, categoryId, event, checked) {

    let filterInfo = this.state.filterInfo;
    let categoryFilter = '';

    this.setState({});

    // Adding filter
    if (checked) {
      filterInfo.currentCategoryFilterIds.push(categoryId);
    }
    // Removing filter
    else {
      filterInfo.currentCategoryFilterIds.splice(filterInfo.currentCategoryFilterIds.indexOf(categoryId), 1);
    }

    // Category filter 
    if (filterInfo.currentCategoryFilterIds.length > 0) {
      categoryFilter = ' AND ' + ProviderHelpers.switchWorkspaceSectionKeys(facetField, this.props.routeParams.area) + '/* IN ("' + filterInfo.currentCategoryFilterIds.join('","') + '")';
    }

    // Update applied filter state
    filterInfo.currentAppliedFilter.categories = categoryFilter;

    filterInfo = Object.assign({}, filterInfo)

    this.setState({filterInfo});
  }
}