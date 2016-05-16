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

import selectn from 'selectn';

import StatusBar from 'views/components/StatusBar';

import CircularProgress from 'material-ui/lib/circular-progress';

import ProviderHelpers from 'common/ProviderHelpers';

/**
* Simple component to handle loading of promises.
*/
export default class PromiseWrapper extends Component {

  static propTypes = {
    computeEntities: PropTypes.instanceOf(List),
    renderOnError: PropTypes.bool
  };

  static defaultProps = {
    renderOnError: false
  };

  constructor(props, context){
    super(props, context);
  }

  render () {

    let statusMessage = null;
    let render = null;

    this.props.computeEntities.forEach(function(computeEntity) {

      if (!List.isList(computeEntity.get('entity'))) {
        console.warn("Trying to use promise wrapper on compute entity that does not return a list.");
        return false;
      }

      let reducedOperation = ProviderHelpers.getEntry(computeEntity.get('entity'), computeEntity.get('id'));

      if (!reducedOperation || (reducedOperation.isError && selectn('message', reducedOperation))) {
        
        if (!this.props.renderOnError) { 
          render = <div><h1>404</h1></div>;
        }

        statusMessage = selectn('message', reducedOperation);
        return false;
      }

      if (reducedOperation.isFetching) {
        render = <div><CircularProgress mode="indeterminate" style={{verticalAlign: 'middle'}} size={1} /> {selectn('message', reducedOperation)}</div>;
        return false;
      }

      if (reducedOperation.success && selectn('message', reducedOperation)) {
        statusMessage = selectn('message', reducedOperation);
      }

    }.bind(this));

    return <div>{(!render) ? this.props.children : render} {<StatusBar message={statusMessage} />}</div>
  }

}