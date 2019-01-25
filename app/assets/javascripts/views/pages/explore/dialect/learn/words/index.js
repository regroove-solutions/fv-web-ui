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
import React, { Component, PropTypes } from 'react'
import Immutable, { Set, Map } from 'immutable'
import classNames from 'classnames'
import provide from 'react-redux-provide'
import selectn from 'selectn'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import {getDialectClassname} from 'views/pages/explore/dialect/helpers'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'
import UIHelpers from 'common/UIHelpers'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'
import WordListView from 'views/pages/explore/dialect/learn/words/list-view'

import CircularProgress from 'material-ui/lib/circular-progress'
import RaisedButton from 'material-ui/lib/raised-button'

import FacetFilterListCategory from 'views/components/Browsing/facet-filter-list-category'

import AlphabetListView from 'views/pages/explore/dialect/learn/alphabet/list-view'

import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect'
import IntlService from 'views/services/intl'
import GridTile from 'material-ui/lib/grid-list/grid-tile'
import { Paper } from 'material-ui'
import ExportDialect from 'views/components/ExportDialect'
const intl = IntlService.instance
/**
 * Learn words
 */
class AlphabetGridTile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const char = selectn('properties.dc:title', this.props.tile)
    return (
      <GridTile
        key={selectn('uid', this.props.tile)}
        style={{
          border: '3px solid #e0e0e0',
          borderRadius: '5px',
          textAlign: 'center',
          height: 'initial',
        }}
      >
        <a
          onClick={this.props.action.bind(this, char, 'startsWith', function(letter) {
            return " AND dc:title LIKE '" + letter + "%'"
          })}
        >
          {char}
        </a>
      </GridTile>
    )
  }
}

const filterDescriptions = new Map([
  [
    'categories',
    function(test) {
      if (test != '') {
        return 'filtering categories' + test
      }
    },
  ],
  [
    'startsWith',
    function(test) {
      if (test != '') {
        return 'starts with ' + test
      }
    },
  ],
  [
    'contains',
    function(test) {
      if (test != '') {
        return 'contains' + test
      }
    },
  ],
])

@provide
export default class PageDialectLearnWords extends PageDialectLearnBase {
  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    computeDocument: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    fetchCategories: PropTypes.func.isRequired,
    computeCategories: PropTypes.object.isRequired,
    overrideBreadcrumbs: PropTypes.func.isRequired,
    updatePageProperties: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    hasPagination: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context)

    const initialCategories = props.routeParams.category ? new Set([props.routeParams.category]) : new Set()

    let filterInfo = new Map({
      currentCategoryFilterIds: initialCategories,
      currentAppliedFilter: new Map({
        categories: props.routeParams.category
          ? ' AND ' +
            ProviderHelpers.switchWorkspaceSectionKeys('fv-word:categories', props.routeParams.area) +
            '/* IN ("' +
            props.routeParams.category +
            '")'
          : '',
      }),
    })

    // If no filters are applied via URL, use props
    const pagePropertiesFilterInfo = selectn([[this._getPageKey()], 'filterInfo'], props.properties.pageProperties)

    if (filterInfo.get('currentCategoryFilterIds').isEmpty() && pagePropertiesFilterInfo) {
      filterInfo = pagePropertiesFilterInfo
    }

    this.state = {
      filterInfo: filterInfo,
      visibleFilter: null,
      searchTerm: null,
    };

    // Bind methods to 'this'
    [
      '_onNavigateRequest',
      '_handleFacetSelected',
      '_handlePagePropertiesChange',
      '_resetURLPagination',
      '_getPageKey',
      '_getURLPageProps',
      '_handleFilterChange',
      '_changeFilter',
      '_updateSearchTerm',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _getPageKey() {
    return this.props.routeParams.area + '_' + this.props.routeParams.dialect_name + '_learn_words'
  }

  fetchData(newProps) {
    ProviderHelpers.fetchIfMissing(
      newProps.routeParams.dialect_path + '/Portal',
      newProps.fetchPortal,
      newProps.computePortal
    )
    ProviderHelpers.fetchIfMissing(
      newProps.routeParams.dialect_path + '/Dictionary',
      newProps.fetchDocument,
      newProps.computeDocument
    )
    ProviderHelpers.fetchIfMissing(
      '/api/v1/path/FV/' + newProps.routeParams.area + '/SharedData/Shared Categories/@children',
      newProps.fetchCategories,
      newProps.computeCategories
    )
  }

  _updateSearchTerm(evt) {
    this.setState({
      searchTerm: evt.target.value,
    })
  }

  _resetSearch(evt) {
    let newFilter = this.state.filterInfo.deleteIn(['currentAppliedFilter', 'contains'], null)
    newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'contains'], null)

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    this._resetURLPagination()

    this.setState({ filterInfo: newFilter, searchTerm: null })

    this.refs.search_term.value = ''
  }

  _clearAllFilters() {}

  _changeFilter(value, type, nxql) {
    if (value && value != '') {
      let newFilter = this.state.filterInfo.updateIn(['currentAppliedFilter', type], () => {
        return nxql(value)
      })

      newFilter = newFilter.updateIn(['currentAppliedFiltersDesc', type], () => {
        let filterDesc

        switch (type) {
          case 'contains':
            filterDesc = 'contain the search term'
            break

          case 'startsWith':
            filterDesc = 'start with the letter '
            break

          case 'categories':
            filterDesc = 'have the categories'
            break
          default: // Note: do nothing
        }
        return (
          <span>
            {filterDesc} <strong>{value}</strong>
          </span>
        )
      })

      // When facets change, pagination should be reset.
      // In these pages (words/phrase), list views are controlled via URL
      this._resetURLPagination()

      this.setState({ filterInfo: newFilter })
    }
  }

  _search(evt) {
    evt.target.blur()
    this._changeFilter(evt.target.value, 'contains', (searchTerm) => {
      return " AND ecm:fulltext = '*" + StringHelpers.clean(searchTerm, 'fulltext') + "*'"
    })
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computePortal,
      },
      {
        id: this.props.routeParams.dialect_path + '/Dictionary',
        entity: this.props.computeDocument,
      },
      {
        id: '/api/v1/path/FV/' + this.props.routeParams.area + '/SharedData/Shared Categories/@children',
        entity: this.props.computeCategories,
      },
    ])

    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      this.props.routeParams.dialect_path + '/Dictionary'
    )
    const fvaDialectId = selectn('response.properties.fva:dialect', computeDocument)

    const computePortal = ProviderHelpers.getEntry(
      this.props.computePortal,
      this.props.routeParams.dialect_path + '/Portal'
    )
    const computeCategories = ProviderHelpers.getEntry(
      this.props.computeCategories,
      '/api/v1/path/FV/' + this.props.routeParams.area + '/SharedData/Shared Categories/@children'
    )

    const computeCategoriesSize = selectn('response.entries.length', computeCategories) || 0

    const isKidsTheme = this.props.routeParams.theme === 'kids'

    let searchSort = {}

    if (this.state.searchTerm) {
      searchSort = {
        DEFAULT_SORT_COL: 'ecm:fulltextScore',
        DEFAULT_SORT_TYPE: 'desc',
      }
    }

    let wordListView = ''

    if (selectn('response.uid', computeDocument)) {
      wordListView = (
        <WordListView
          renderSimpleTable
          DEFAULT_PAGE_SIZE={10}
          controlViaURL
          onPaginationReset={this._resetURLPagination}
          onPagePropertiesChange={this._handlePagePropertiesChange}
          parentID={selectn('response.uid', computeDocument)}
          filter={this.state.filterInfo}
          {...this._getURLPageProps()}
          routeParams={this.props.routeParams}
          {...searchSort}
        />
      )
    }

    // Render kids view

    // Or Mobile
    if (isKidsTheme || isMobile) {
      let pageSize = 8 // Items per Kids page

      // Mobile but not Kids
      if (!isKidsTheme && isMobile) {
        pageSize = 10 // Items per page for mobile, but not Kids
      }

      const kidsFilter = this.state.filterInfo.setIn(
        ['currentAppliedFilter', 'kids'],
        ' AND fv:available_in_childrens_archive=1'
      )

      return (
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-12', 'col-md-8', 'col-md-offset-2')}>
              {React.cloneElement(wordListView, {
                gridListView: true,
                disablePageSize: true,
                DEFAULT_PAGE_SIZE: pageSize,
                filter: kidsFilter,
              })}
            </div>
          </div>
        </PromiseWrapper>
      )
    }
    const dialectClassName = getDialectClassname(computeDocument)
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className={classNames('row', 'row-create-wrapper')}>
          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-8', 'text-right')}>
            <AuthorizationFilter
              hideFromSections
              routeParams={this.props.routeParams}
              filter={{
                role: ['Record', 'Approve', 'Everything'],
                entity: selectn('response', computeDocument),
                login: this.props.computeLogin,
              }}
            >
              <RaisedButton
                label={intl.trans(
                  'views.pages.explore.dialect.learn.words.create_new_word',
                  'Create New Word',
                  'words'
                )}
                onTouchTap={this._onNavigateRequest.bind(this, 'create')}
                primary
              />
            </AuthorizationFilter>
          </div>
        </div>
        <div className="row">
          <div className={classNames('col-xs-12', 'col-md-3', computeCategoriesSize == 0 ? 'hidden' : null)}>

            <ExportDialect
              // fileName="File name.csv"
              // fileUrl="//google.ca"
              // isErrored={false}
              // isReady={false}
              // isProcessing={false}
              dialectId={fvaDialectId}
            />
            <div>
              <h3>Words</h3>

              <RaisedButton
                style={{ width: '100%', textAlign: 'left' }}
                label={intl.trans(
                  'views.pages.explore.dialect.learn.words.find_by_category',
                  'Show All Words',
                  'words'
                )}
                onTouchTap={this._clearAllFilters()}
              />
              <br />

              <RaisedButton
                style={{ width: '100%', textAlign: 'left' }}
                label={intl.trans(
                  'views.pages.explore.dialect.learn.words.find_by_category',
                  'Filter by Category',
                  'words'
                )}
                onTouchTap={this._handleFilterChange.bind(this, 'find_by_category')}
              />
              <br />
              {this.state.visibleFilter === 'find_by_category' && (
                <FacetFilterListCategory
                  title={intl.trans('categories', 'Categories', 'first')}
                  appliedFilterIds={this.state.filterInfo.get('currentCategoryFilterIds')}
                  facetField={ProviderHelpers.switchWorkspaceSectionKeys(
                    'fv-word:categories',
                    this.props.routeParams.area
                  )}
                  onFacetSelected={this._handleFacetSelected}
                  facets={selectn('response.entries', computeCategories) || []}
                />
              )}
              {intl.trans('views.pages.explore.dialect.learn.words.find_by_alphabet', 'Browse Alphabetically', 'words')}
              <br />
              {(() => {
                return React.cloneElement(
                  <AlphabetListView
                    pagination={false}
                    routeParams={this.props.routeParams}
                    dialect={selectn('response', computePortal)}
                  />,
                  {
                    gridListView: true,
                    gridViewProps: {
                      className: dialectClassName,
                      cols: 10,
                      cellHeight: 25,
                      action: this._changeFilter,
                      style: { overflowY: 'hidden', padding: '10px' },
                    },
                    gridListTile: AlphabetGridTile,
                  }
                )
              })()}
            </div>
            <hr />
            <div>
              <h3>More in {selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal)}</h3>

              <ul>
                <li>Browse Words</li>
                <li>Browse Phrases</li>
                <li>Browse Songs</li>
                <li>Browse Stories</li>
                <li>View Alphabet</li>
                <li>View Portal Page</li>
                <li>View Language Page</li>
              </ul>
            </div>
          </div>
          <div className={classNames('col-xs-12', computeCategoriesSize == 0 ? 'col-md-12' : 'col-md-9')}>
            <h1>
              {selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal)}{' '}
              {intl.trans('words', 'Words', 'first')}
            </h1>

            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                ref="search_term"
                onBlur={(evt) => this._updateSearchTerm(evt)}
                onKeyPress={(evt) => (evt.key === 'Enter' ? this._search(evt) : null)}
              />{' '}
              &nbsp;
              <RaisedButton
                label={intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')}
                onTouchTap={this._changeFilter.bind(this, this.state.searchTerm, 'contains', function(searchTerm) {
                  return " AND ecm:fulltext = '*" + StringHelpers.clean(searchTerm, 'fulltext') + "*'"
                })}
                primary
              />
              <RaisedButton
                label={intl.trans('views.pages.explore.dialect.learn.words.reset_search', 'Clear Search', 'words')}
                onTouchTap={(evt) => this._resetSearch()}
                primary={false}
              />
              <br />
            </div>

            <div className={classNames('alert', 'alert-info')}>
              {(() => {
                if (
                  this.state.filterInfo.get('currentAppliedFiltersDesc') &&
                  !this.state.filterInfo.get('currentAppliedFiltersDesc').isEmpty()
                ) {
                  const appliedFilters = ['Showing words that ']
                  let i = 0

                  this.state.filterInfo.get('currentAppliedFiltersDesc').map(function(v, k, t) {
                    appliedFilters.push(v)

                    if (t.size > 1 && t.size - 1 != i) {
                      appliedFilters.push(
                        <span>
                          {' '}
                          <span style={{ textDecoration: 'underline' }}>AND</span>{' '}
                        </span>
                      )
                    }

                    ++i
                  })

                  return appliedFilters
                }
                return (
                  <span>
                      Showing <strong>all words</strong> in the dictionary <strong>listed alphabetically</strong>.
                  </span>
                )
              })()}
            </div>

            <div className={dialectClassName}>{wordListView}</div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}
