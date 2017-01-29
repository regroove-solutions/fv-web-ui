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

import CircularProgress from 'material-ui/lib/circular-progress';
import RaisedButton from 'material-ui/lib/raised-button';

import DocumentListView from 'views/components/Document/DocumentListView';
import FacetFilterList from 'views/components/Browsing/facet-filter-list';

/**
* Learn phrases
*/
@provide
export default class PageDialectLearnPhrases extends PageDialectLearnBase {

  static defaultProps = {
    DISABLED_SORT_COLS: ['state', 'fv-phrase:phrase_books'],
    DEFAULT_PAGE: 0,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc'
  }

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    computeDocument: PropTypes.object.isRequired, 
    computeLogin: PropTypes.object.isRequired, 
    fetchDialect2: PropTypes.func.isRequired,
    fetchPhrases: PropTypes.func.isRequired,
    fetchCategories: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    computePhrases: PropTypes.object.isRequired,
    computeCategories: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,

    DISABLED_SORT_COLS: PropTypes.array,
    DEFAULT_PAGE: PropTypes.number,
    DEFAULT_PAGE_SIZE: PropTypes.number,
    DEFAULT_SORT_COL: PropTypes.string,
    DEFAULT_SORT_TYPE: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      columns : [
        { name: 'title', title: 'Phrase', render: function(v, data, cellProps){
          //return <a key={data.id} onTouchTap={_this._handleNavigate.bind(this, data.id)}>{v}</a>
          return v;
        }, sortName: 'dc:title'},
        { name: 'fv:definitions', title: 'Definitions', render: function(v, data, cellProps) {
            return this.renderComplexArrayRow(selectn('properties.' + cellProps.name, data), function (entry, i) {
              if (entry.language == this.props.DEFAULT_LANGUAGE && i < 2) {
                return <li key={i}>{entry.translation}</li>;
              }
            }.bind(this));
          }.bind(this),
          sortName: 'fv:definitions/0/translation'
        },
        { name: 'fv-phrase:phrase_books', title: 'Phrase Books', render: function(v, data, cellProps) {
            return this.renderComplexArrayRow(selectn('contextParameters.phrase.phrase_books', data), function (entry, i) {
                return <li key={i}>{selectn('dc:title', entry)}</li>;
            });
          }.bind(this)
        },
        { name: 'state', title: 'State' }
      ],
      sortInfo: {
        uiSortOrder: [], 
        currentSortCols: this.props.DEFAULT_SORT_COL,
        currentSortType: this.props.DEFAULT_SORT_TYPE
      },
      filterInfo: {
        currentCategoryFilterIds: [],
        currentAppliedFilter: {
          categories: ''
        }
      }
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onEntryNavigateRequest', '_handleRefetch', '_handleSortChange', '_handleColumnOrderChange', '_handleFacetSelected', '_resetColumns'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary');

    newProps.fetchCategories('/api/v1/path/' + newProps.routeParams.dialect_path + '/Phrase Books/@children');

    this._fetchListViewData(newProps, newProps.DEFAULT_PAGE, newProps.DEFAULT_PAGE_SIZE, newProps.DEFAULT_SORT_TYPE, newProps.DEFAULT_SORT_COL);
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    props.fetchPhrases(props.routeParams.dialect_path + '/Dictionary',
    Object.values(this.state.filterInfo.currentAppliedFilter).join('') + 
    '&currentPageIndex=' + pageIndex + 
    '&pageSize=' + pageSize + 
    '&sortOrder=' + sortOrder +
    '&sortBy=' + sortBy
    );
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path + '/Dictionary',
      'entity': this.props.computePhrases
    },{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    },{
      'id': '/api/v1/path/' + this.props.routeParams.dialect_path + '/Phrase Books/@children',
      'entity': this.props.computeCategories
    }])

    const computeDocument = ProviderHelpers.getEntry(this.props.computeDocument, this.props.routeParams.dialect_path + '/Dictionary');
    const computePhrases = ProviderHelpers.getEntry(this.props.computePhrases, this.props.routeParams.dialect_path + '/Dictionary');
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
    const computePhraseBooks = ProviderHelpers.getEntry(this.props.computeCategories, '/api/v1/path/' + this.props.routeParams.dialect_path + '/Phrase Books/@children');

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
                <div className="col-xs-12 col-md-3">
                  <FacetFilterList
                    title='Categories'
                    facetField='fv-phrase:phrase_books'
                    onFacetSelected={this._handleFacetSelected}
                    facets={selectn('response.entries', computePhraseBooks) || []} />
                </div>
                <div className="col-xs-12 col-md-9">
                  <h1>{selectn('response.title', computeDialect2)} Phrases</h1>

                  {(() => {
                    if (selectn('response.entries', computePhrases)) {

                      return <DocumentListView
                        objectDescriptions="phrases" 
                        data={computePhrases}
                        refetcher={this._handleRefetch}
                        onSortChange={this._handleSortChange}
                        onSelectionChange={this._onEntryNavigateRequest}
                        onColumnOrderChange={this._handleColumnOrderChange}
                        columns={this.state.columns}
                        sortInfo={this.state.sortInfo.uiSortOrder}
                        className="browseDataGrid" 
                        dialect={selectn('response', computeDialect2)} />;
                    }
                  })()}

                </div>
              </div>
        </PromiseWrapper>;
  }
}