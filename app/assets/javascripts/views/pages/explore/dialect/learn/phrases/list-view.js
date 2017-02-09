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
import UIHelpers from 'common/UIHelpers';

import DocumentListView from 'views/components/Document/DocumentListView';

import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view';

/**
* List view for phrases
*/
@provide
export default class ListView extends DataListView {
  
  static defaultProps = {
    DISABLED_SORT_COLS: ['state', 'fv-phrase:phrase_books'],
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
    computeLogin: PropTypes.object.isRequired, 
    fetchDialect2: PropTypes.func.isRequired,
    fetchPhrases: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    computePhrases: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    filter: PropTypes.object,
    data: PropTypes.string,

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
        }, sortName: 'fv:custom_order'},
        { name: 'fv:definitions', title: 'Definitions', render: function(v, data, cellProps) {
            return UIHelpers.renderComplexArrayRow(selectn('properties.' + cellProps.name, data), function (entry, i) {
              if (entry.language == this.props.DEFAULT_LANGUAGE && i < 2) {
                return <li key={i}>{entry.translation}</li>;
              }
            }.bind(this));
          }.bind(this),
          sortName: 'fv:definitions/0/translation'
        },
        { name: 'fv-phrase:phrase_books', title: 'Phrase Books', render: function(v, data, cellProps) {
            return UIHelpers.renderComplexArrayRow(selectn('contextParameters.phrase.phrase_books', data), function (entry, i) {
                return <li key={i}>{selectn('dc:title', entry)}</li>;
            });
          }.bind(this)
        }
      ],
      sortInfo: {
        uiSortOrder: [], 
        currentSortCols: this.props.DEFAULT_SORT_COL,
        currentSortType: this.props.DEFAULT_SORT_TYPE
      },
      pageInfo: {
        page: this.props.DEFAULT_PAGE,
        pageSize: this.props.DEFAULT_PAGE_SIZE
      }
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onEntryNavigateRequest', '_handleRefetch', '_handleSortChange', '_handleColumnOrderChange', '_resetColumns'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    this._fetchListViewData(newProps, newProps.DEFAULT_PAGE, newProps.DEFAULT_PAGE_SIZE, newProps.DEFAULT_SORT_TYPE, newProps.DEFAULT_SORT_COL);
  }

  _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
    props.fetchPhrases(props.routeParams.dialect_path + '/Dictionary',
    (selectn('filter.currentAppliedFilter', this.props) ? Object.values(this.props.filter.currentAppliedFilter).join('') : '') + 
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
    }])

    const computePhrases = ProviderHelpers.getEntry(this.props.computePhrases, this.props.routeParams.dialect_path + '/Dictionary');
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
                {(() => {
                if (selectn('response.entries', computePhrases)) {

                    return <DocumentListView
                                objectDescriptions="phrases" 
                                data={computePhrases}
                                refetcher={this._handleRefetch}
                                onSortChange={this._handleSortChange}
                                onSelectionChange={this._onEntryNavigateRequest}
                                page={this.state.pageInfo.page}
                                pageSize={this.state.pageInfo.pageSize}
                                onColumnOrderChange={this._handleColumnOrderChange}
                                columns={this.state.columns}
                                sortInfo={this.state.sortInfo.uiSortOrder}
                                className="browseDataGrid" 
                                dialect={selectn('response', computeDialect2)} />;
                }
                })()}
        </PromiseWrapper>;
  }
}