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

import RaisedButton from 'material-ui/lib/raised-button';

import ProviderHelpers from 'common/ProviderHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

import PortalList from 'views/components/Browsing/portal-list';

/**
* Explore Archive page shows all the families in the archive
*/
@provide
export default class PageKidsHome extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    fetchPortals: PropTypes.func.isRequired,
    computePortals: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired
  };

  /*static contextTypes = {
      muiTheme: React.PropTypes.object.isRequired
  };*/

  constructor(props, context){
    super(props, context);

    this.state = {
      pathOrId: null
    };

    // Bind methods to 'this'
    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    const pathOrId = '/' + newProps.properties.domain + '/sections';

    this.props.fetchPortals(pathOrId);
    this.setState({pathOrId})
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath('/kids' + path);
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.state.pathOrId,
      'entity': this.props.computePortals
    }])

    const computePortals = ProviderHelpers.getEntry(this.props.computePortals, this.state.pathOrId);

    const homePageStyle = {
      position: 'relative',
      minHeight: '155px',
      height: '600px',
      backgroundColor: 'transparent',
      backgroundSize: 'cover',
      backgroundPosition: '0 0',
      marginTop: '25px'
    }

    return <PromiseWrapper computeEntities={computeEntities}>
            <div className="container-fluid">
             <div className="row" style={homePageStyle}>
              <div className={classNames('col-xs-3', 'col-md-4', 'text-right')}>
                <img src="/assets/images/boy.gif" alt="Boy" />
              </div>
              <div className={classNames('col-xs-3', 'col-md-4', 'text-center')}>
                <span style={{width: '45%'}}>
                  <RaisedButton fullWidth={true} label="Enter Kids Area" onTouchTap={this._onNavigateRequest.bind(this, '/FV/Workspaces/Data/')} style={{marginTop: '20vh'}} />
                </span>
              </div>
              <div className={classNames('col-xs-3', 'col-md-4', 'text-left')}>
                <img src="/assets/images/girl.gif" alt="Girl" />
              </div>
             </div>
            </div>
          </PromiseWrapper>;
  }
}