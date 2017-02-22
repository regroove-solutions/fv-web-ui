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
import ReactDOM from 'react-dom';
import Immutable, { List, Map } from 'immutable';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import ProviderHelpers from 'common/ProviderHelpers';

import Game from './wrapper'

/**
* Play games
*/
@provide
export default class Jigsaw extends Component {

  static propTypes = {
    fetchResources: PropTypes.func.isRequired,
    computeResources: PropTypes.object.isRequired,
    fetchWords: PropTypes.func.isRequired,
    computeWords: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired
  }

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context);
  }

  /**
   * componentDidMount
   */
  componentDidMount () {
    this.fetchData(this.props);
  }

  fetchData(props, pageIndex, pageSize, sortOrder, sortBy) {
    props.fetchResources(props.routeParams.dialect_path + '/Resources',
    'AND ecm:primaryType ILIKE \'FVPicture\' AND picture:views/3/width > 1000' + 
    '&currentPageIndex=0' + 
    '&pageSize=4'
    );
  }

  /**
   * Render
   */
  render() {

    let game = '';

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path + '/Resources',
      'entity': this.props.computeResources
    }])

    const computeResources = ProviderHelpers.getEntry(this.props.computeResources, this.props.routeParams.dialect_path + '/Resources');

    let pictures = {};

    (selectn('response.entries', computeResources) || []).forEach(function(v, k) {
      //pictures['picture' + (k + 1)] = selectn('properties.file:content.data', v) + '?inline=true';
    })

    //if (Object.entries(pictures).length > 0) {
      game = <Game pictures={pictures} />;
    //}

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
            <div className="row">
              <div className="col-xs-12">
                <h1>Jigsaw</h1>
                {game}
              </div>
            </div>
        </PromiseWrapper>;
  }
}