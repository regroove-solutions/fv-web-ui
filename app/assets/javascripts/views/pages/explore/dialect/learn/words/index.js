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
* Learn words
*/
@provide
export default class PageDialectLearnWords extends PageDialectLearnBase {
  
  static defaultProps = {
    DISABLED_SORT_COLS: ['state', 'fv-word:categories'],
    DEFAULT_PAGE: 0,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'fv:custom_order',
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
    fetchWords: PropTypes.func.isRequired,
    fetchCategories: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    computeWords: PropTypes.object.isRequired,
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
        { name: 'title', title: 'Word', render: function(v, data, cellProps){
          //return <a key={data.id} onTouchTap={_this._handleNavigate.bind(this, data.id)}>{v}</a>
          return v;
        }, sortName: 'fv:custom_order'},
        /*{ name: 'fv:definitions', title: 'Definitions', render: function(v, data, cellProps) {
            return this.renderComplexArrayRow(selectn('properties.' + cellProps.name, data), function (entry, i) {
              if (entry.language == DEFAULT_LANGUAGE && i < 2) {
                return <li key={i}>{entry.translation}</li>;
              }
            });
          }.bind(this), sortName: 'fv:definitions/0/translation'
        },*/
        { name: 'fv:literal_translation', title: 'Literal Translation', render: function(v, data, cellProps) {
            return this.renderComplexArrayRow(selectn('properties.' + cellProps.name, data), function (entry, i) {
              if (entry.language == this.props.DEFAULT_LANGUAGE && i < 2) {
                return <li key={i}>{entry.translation}</li>;
              }
            }.bind(this));
          }.bind(this),
          sortName: 'fv:literal_translation/0/translation'
        },
        { name: 'fv-word:pronunciation', title: 'Pronunciation', render: function(v, data, cellProps) { return selectn('properties.fv-word:pronunciation', data); } },
        { name: 'fv-word:categories', title: 'Categories', render: function(v, data, cellProps) {
            return this.renderComplexArrayRow(selectn('contextParameters.word.categories', data), function (entry, i) {
                return <li key={i}>{selectn('dc:title', entry)}</li>;
            });
          }.bind(this)
        },
        { name: 'fv-word:part_of_speech', title: 'Part of Speech', render: function(v, data, cellProps) { return selectn('contextParameters.word.part_of_speech', data); } }
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

    newProps.fetchCategories('/api/v1/path/FV/' + newProps.routeParams.area + '/SharedData/Shared Categories/@children');

    this._fetchListViewData(newProps, newProps.DEFAULT_PAGE, newProps.DEFAULT_PAGE_SIZE, newProps.DEFAULT_SORT_TYPE, newProps.DEFAULT_SORT_COL);
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    props.fetchWords(props.routeParams.dialect_path + '/Dictionary',
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
      'entity': this.props.computeWords
    },{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    },{
      'id': '/api/v1/path/FV/' + this.props.routeParams.area + '/SharedData/Shared Categories/@children',
      'entity': this.props.computeCategories
    }])

    const computeDocument = ProviderHelpers.getEntry(this.props.computeDocument, this.props.routeParams.dialect_path + '/Dictionary');
    const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this.props.routeParams.dialect_path + '/Dictionary');
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
    const computeCategories = ProviderHelpers.getEntry(this.props.computeCategories, '/api/v1/path/FV/' + this.props.routeParams.area + '/SharedData/Shared Categories/@children');

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
              <div className="row">
                <div className="col-xs-8">
                </div>
                <div className={classNames('col-xs-4', 'text-right')}>
                  <AuthorizationFilter filter={{role: ['Record', 'Approve', 'Everything'], entity: selectn('response', computeDocument), login: this.props.computeLogin}}>
                    <RaisedButton label="Create New Word" onTouchTap={this._onNavigateRequest.bind(this, 'create')} primary={true} />
                  </AuthorizationFilter>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-md-3">
                  <FacetFilterList
                    title='Categories'
                    facetField='fv-word:categories'
                    onFacetSelected={this._handleFacetSelected}
                    facets={selectn('response.entries', computeCategories) || []} />
                </div>
                <div className="col-xs-12 col-md-9">
                  <h1>{selectn('response.title', computeDialect2)} Words</h1>

                  {(() => {
                    if (selectn('response.entries', computeWords)) {

                        return <DocumentListView
                                  objectDescriptions="words" 
                                  data={computeWords}
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