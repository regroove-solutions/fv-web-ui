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
import React, { Component, PropTypes } from 'react';
import Immutable, { List, Map } from 'immutable';

import provide from 'react-redux-provide';
import selectn from 'selectn';
import classNames from 'classnames';

import ProviderHelpers from 'common/ProviderHelpers';

import PortalList from 'views/components/Browsing/portal-list'
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

import Checkbox from 'material-ui/lib/checkbox';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

import withPagination from 'views/hoc/grid-list/with-pagination';
import withFilter from 'views/hoc/grid-list/with-filter';

const FilteredPortalList = withFilter(PortalList);

/**
* Explore Archive page shows all the families in the archive
*/
@provide
export default class ExploreDialects extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    fetchPortals: PropTypes.func.isRequired,
    computePortals: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  /*static contextTypes = {
      muiTheme: React.PropTypes.object.isRequired
  };*/

  constructor(props, context){
    super(props, context);

    this.state = {
      pathOrId: null,
      filteredList: null,
      open: false
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', 'fixedListFetcher'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    const pathOrId = '/' + newProps.properties.domain + '/' + newProps.routeParams.area;

    newProps.fetchPortals(pathOrId);
    this.setState({pathOrId})
  }

  fixedListFetcher(list) {
    this.setState({
      filteredList: list
    });
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.area != this.props.routeParams.area) {
      this.fetchData(nextProps);
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath('/' + this.props.routeParams.theme + path);
  }

  render() {

    const isKidsTheme = this.props.routeParams.theme === 'kids';

    const computeEntities = Immutable.fromJS([{
      'id': this.state.pathOrId,
      'entity': this.props.computePortals
    }])

    const computePortals = ProviderHelpers.getEntry(this.props.computePortals, this.state.pathOrId);
    
    let portalsEntries = selectn('response.entries', computePortals) || [];

    // Sort based on dialect name (all FVPortals have dc:title 'Portal')
    let sortedPortals = portalsEntries.sort(function(a, b){

        let a2 = selectn('contextParameters.ancestry.dialect.dc:title', a);
        let b2 = selectn('contextParameters.ancestry.dialect.dc:title', b);

        if(a2 < b2) return -1;
        if(a2 > b2) return 1;
        return 0;
    });

    let portalListProps = {
      action:this._onNavigateRequest,
      filterOptionsKey:'Portals',
      fixedList:true,
      area:this.props.routeParams.area,
      fixedListFetcher:this.fixedListFetcher,
      filteredItems:this.state.filteredList,
      fieldMapping: {
        title: 'contextParameters.ancestry.dialect.dc:title',
        logo: 'contextParameters.portal.fv-portal:logo'
      },
      metadata:selectn('response', computePortals),
      items: sortedPortals
    };

    let portalList = <FilteredPortalList {...portalListProps} />;

    if (isKidsTheme) {
      portalList = <PortalList {...portalListProps} cols={6} />
    }

    return <PromiseWrapper computeEntities={computeEntities}>
             <div className="row">
               
              <div className="col-xs-12">

                  <div className={classNames({'hidden': isKidsTheme})}>

                    <h1>{this.props.properties.title} Archive</h1>

                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>

                  </div>

                  {portalList}
                  
              </div>
            </div>
          </PromiseWrapper>;
  }
}