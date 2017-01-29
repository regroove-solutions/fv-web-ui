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

import ConfGlobal from 'conf/local.json';

import Colors from 'material-ui/lib/styles/colors';

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

/**
* Explore Archive page shows all the families in the archive
*/
@provide
export default class ExploreDialects extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    fetchDialects: PropTypes.func.isRequired,
    computeDialects: PropTypes.object.isRequired,
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
      filteredByText: false,
      filteredByRole: false,
      searchTerm: null
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_handleSearchSubmit', '_handleSearchReset', '_handleMyDialectsChange', '_handleSearchFieldChange'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    const pathOrId = '/' + newProps.properties.domain + '/' + newProps.routeParams.area;

    this.props.fetchPortals(pathOrId);
    this.setState({pathOrId})
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
    this.props.pushWindowPath('/explore' + path);
  }

  _handleSearchFieldChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  _handleSearchSubmit() {
    let newQueryParam = this.refs.searchTextField.getValue();

    let computePortalsEntry = ProviderHelpers.getEntry(this.props.computePortals, this.state.pathOrId);

    let entries = selectn('response.entries', computePortalsEntry);

    if (newQueryParam != "" && entries.length > 0) {
      let filteredList = new List(entries).filter(function(dialect) {
        return selectn('contextParameters.ancestry.dialect.dc:title', dialect).search(new RegExp(newQueryParam, "i")) !== -1;
      });

      this.setState({filteredList: filteredList.toJS()});
    }
  }

  _handleMyDialectsChange(event, checked) {
    let computePortalsEntry = ProviderHelpers.getEntry(this.props.computePortals, this.state.pathOrId);

    let entries = this.state.filteredList || selectn('response.entries', computePortalsEntry);

    if (checked && entries.length > 0) {
      let filteredList = new List(entries).filter(function(dialect) {
        return ProviderHelpers.isActiveRole(selectn('contextParameters.dialect.roles', dialect));
      });

      this.setState({filteredList: filteredList.toJS(), filteredByRole: true});
    } else {
      this.setState({filteredList: null, filteredByRole: false});
    }
  }

  _handleSearchReset() {
    this.setState({filteredList: null, searchTerm: ''});
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.state.pathOrId,
      'entity': this.props.computePortals
    }])

    const computePortals = ProviderHelpers.getEntry(this.props.computePortals, this.state.pathOrId);

    return <PromiseWrapper computeEntities={computeEntities}>
             <div className="row">
              <div className="col-md-4 col-xs-12">

                <div className="row">

                  <div className="col-xs-12">

                    <h1>{this.props.properties.title} Archive</h1>
                    <div>
                      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
                      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
                    </div>

                  </div>

                </div>

                <div className="row">

                  <div className="col-xs-12">
                    <div className={classNames('panel', 'panel-default')}>
                      <div className="panel-heading">
                        Filter dialects:
                      </div>
                      <div className="panel-body">
                        <div className="row">
                          <div className="col-xs-6">          
                            <TextField ref="searchTextField" value={this.state.searchTerm} onEnterKeyDown={this._handleSearchSubmit} onChange={this._handleSearchFieldChange} fullWidth={true} />                   
                          </div>
                          <div className="col-xs-5">                
                            <RaisedButton onTouchTap={this._handleSearchReset} label="Reset" primary={true} /> <RaisedButton onTouchTap={this._handleSearchSubmit} label="Filter" primary={true} /> 
                          </div> 
                        </div> 
                        <div className="row">
                          <div className="col-xs-12">          
                            <Checkbox checked={this.state.filteredByRole} onCheck={this._handleMyDialectsChange} label="Show only dialects I can contribute to or are a member of." />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              <div className="col-md-8 col-xs-12">
                  <h2>Browse the following Dialects:</h2>
                  <PortalList
                    action={this._onNavigateRequest}
                    tiles={this.state.filteredList || selectn('response.entries', computePortals) || []} />
              </div>
            </div>
          </PromiseWrapper>;
  }
}