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
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import ProviderHelpers from 'common/ProviderHelpers';
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base';
import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view';

import CircularProgress from 'material-ui/lib/circular-progress';
import RaisedButton from 'material-ui/lib/raised-button';

import FacetFilterList from 'views/components/Browsing/facet-filter-list';

/**
* Learn phrases
*/
@provide
export default class PageDialectLearnPhrases extends PageDialectLearnBase {

  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    computeDocument: PropTypes.object.isRequired, 
    computeLogin: PropTypes.object.isRequired, 
    fetchDialect2: PropTypes.func.isRequired,
    fetchCategories: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    computeCategories: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      filterInfo: {
        currentCategoryFilterIds: [],
        currentAppliedFilter: {
          categories: ''
        }
      }
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_handleFacetSelected'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary');

    newProps.fetchCategories('/api/v1/path/' + newProps.routeParams.dialect_path + '/Phrase Books/@children');
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    },{
      'id': '/api/v1/path/' + this.props.routeParams.dialect_path + '/Phrase Books/@children',
      'entity': this.props.computeCategories
    }])

    const computeDocument = ProviderHelpers.getEntry(this.props.computeDocument, this.props.routeParams.dialect_path + '/Dictionary');
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
    const computePhraseBooks = ProviderHelpers.getEntry(this.props.computeCategories, '/api/v1/path/' + this.props.routeParams.dialect_path + '/Phrase Books/@children');

    let computePhraseBooksSize = selectn('response.entries.length', computePhraseBooks) || 0;

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
              <div className="row">
                <div className="col-xs-8">
                </div>
                <div className={classNames('col-xs-4', 'text-right')}>
                  <AuthorizationFilter filter={{role: ['Record', 'Approve', 'Everything'], entity: selectn('response', computeDocument), login: this.props.computeLogin}}>
                    <RaisedButton label="Create New Phrase" onTouchTap={this._onNavigateRequest.bind(this, 'create')} primary={true} />
                  </AuthorizationFilter>
                </div>
              </div>
              <div className="row">
                <div className={classNames('col-xs-12', 'col-md-3', (computePhraseBooksSize == 0) ? 'hidden': null)}>
                  <FacetFilterList
                    title='Categories'
                    facetField='fv-phrase:phrase_books'
                    onFacetSelected={this._handleFacetSelected}
                    facets={selectn('response.entries', computePhraseBooks) || []} />
                </div>
                <div className={classNames('col-xs-12', (computePhraseBooksSize == 0) ? 'col-md-12': 'col-md-9')}>
                  <h1>{selectn('response.title', computeDialect2)} Phrases</h1>
                  <PhraseListView
                    filter={this.state.filterInfo}
                    routeParams={this.props.routeParams} />
                </div>
              </div>
        </PromiseWrapper>;
  }
}