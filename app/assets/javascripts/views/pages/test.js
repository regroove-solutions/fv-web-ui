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

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import CircularProgress from 'material-ui/lib/circular-progress';

import ProviderHelpers from 'common/ProviderHelpers';

/**
* Explore Archive page shows all the families in the archive
*/
@provide
export default class Test extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  /*static contextTypes = {
      muiTheme: React.PropTypes.object.isRequired
  };*/

  constructor(props, context){
    super(props, context);

    /*let computeEntities = new List();

    let computePortal = new Map([['id', '/FV/sections/Data/TestFamily/TestLanguage/PopoDialect'], ['entity', this.props.computePortal]]);
*/

    this.state = {
      pathOrId: null
    }
  }

  fetchData(newProps) {

    const pathOrId = "/FV/sections/Data/TestFamily/TestLanguage/PopoDialect";

    this.props.fetchDialect2(pathOrId, 'PopoDialect', 'aaa', '444');
    this.setState({
      pathOrId: pathOrId
    });
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    //if (nextProps.windowPath !== this.props.windowPath || nextProps.routeParams.area != this.props.routeParams.area) {
    //  this.fetchData(nextProps);
    //}
  }

  /*shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps.computePortal.size);
    if (nextProps.computePortal.size === 0) {
      return false;
    }

    return true;
  }*/

  render() {

    //let computeEntities = new List();
    //let computePortal = new Map([['id', '/FV/sections/Data/TestFamily/TestLanguage/PopoDialect'], ['entity', this.props.computePortal]]);

    const computeEntities = Immutable.fromJS([{
      'id': this.state.pathOrId,
      'entity': this.props.computeDialect2
    }])


    /*let portalOperation = ProviderHelpers.getEntry(computePortal, '/FV/sections/Data/TestFamily/TestLanguage/PopoDialect');
    console.log(portalOperation);
    

    if (!portalOperation || portalOperation.isFetching) {
      return <div><CircularProgress mode="indeterminate" size={5} /> {selectn('message', portalOperation)}</div>;
    }

    if (portalOperation.isError) {
      return <div>{portalOperation.message}</div>
    }

    let portalResponse = selectn('response', portalOperation);*/

    return <div className="row">
            <pre>
              <PromiseWrapper computeEntities={computeEntities}>
                {JSON.stringify(this.props.computeDialect2, null, '\t')}
              </PromiseWrapper>
            </pre>
          </div>;
  }
}