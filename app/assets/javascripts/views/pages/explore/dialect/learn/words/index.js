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
import { isMobile } from 'react-device-detect'
import provide from 'react-redux-provide'
import selectn from 'selectn'

import GridTile from 'material-ui/lib/grid-list/grid-tile'
import RaisedButton from 'material-ui/lib/raised-button'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

import { SearchWordsPhrases } from 'components/SearchWordsPhrases'
import AlphabetListView from 'views/pages/explore/dialect/learn/alphabet/list-view'
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
import FacetFilterListCategory from 'views/components/Browsing/facet-filter-list-category'
import IntlService from 'views/services/intl'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'
import WordListView from 'views/pages/explore/dialect/learn/words/list-view'

// import '!style-loader!css-loader!react-image-gallery/build/image-gallery.css'

const intl = IntlService.instance

/**
 * Learn words
 */
class AlphabetGridTile extends Component {
  static defaultProps = {
    action: () => {},
  }
  static propTypes = {
    action: PropTypes.any, // TODO: set appropriate propType
    tile: PropTypes.any, // TODO: set appropriate propType
  }
  constructor(props) {
    super(props)
    const { tile } = this.props
    this.state = {
      char: selectn('properties.dc:title', tile),
      uid: selectn('uid', tile),
    }
    ;['_handleClick'].forEach((method) => (this[method] = this[method].bind(this)))
  }
  render() {
    const { char, uid } = this.state
    return (
      <GridTile
        key={uid}
        className="AlphabetGridTile"
        style={{
          height: 'initial',
        }}
      >
        <a onClick={this._handleClick}>{char}</a>
      </GridTile>
    )
  }
  _handleClick() {
    const { char } = this.state
    this.props.action(char, 'startsWith', (letter) => {
      const query = ` AND dc:title LIKE '${letter}%'`
      return query
    })
  }
}

/*
const filterDescriptions = new Map([
  [
    'categories',
    (test) => {
      if (test != '') {
        return 'filtering categories' + test
      }
    },
  ],
  [
    'startsWith',
    (test) => {
      if (test != '') {
        return 'starts with ' + test
      }
    },
  ],
  [
    'contains',
    (test) => {
      if (test != '') {
        return 'contains' + test
      }
    },
  ],
])
*/

@provide
export default class PageDialectLearnWords extends PageDialectLearnBase {
  static propTypes = {
    computeCategories: PropTypes.object.isRequired,
    computeDocument: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    computePortal: PropTypes.object.isRequired,
    fetchCategories: PropTypes.func.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    hasPagination: PropTypes.bool,
    overrideBreadcrumbs: PropTypes.func.isRequired,
    properties: PropTypes.object.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    updatePageProperties: PropTypes.func.isRequired,
    windowPath: PropTypes.string.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    const routeParamsCategory = props.routeParams.category
    const initialCategories = routeParamsCategory ? new Set([routeParamsCategory]) : new Set()
    const currentAppliedFilterCategoriesParam1 = ProviderHelpers.switchWorkspaceSectionKeys(
      'fv-word:categories',
      props.routeParams.area
    )
    const currentAppliedFilterCategories = routeParamsCategory
      ? ` AND ${currentAppliedFilterCategoriesParam1}/* IN ("${routeParamsCategory}")`
      : ''

    let filterInfo = new Map({
      currentCategoryFilterIds: initialCategories,
      currentAppliedFilter: new Map({
        categories: currentAppliedFilterCategories,
      }),
    })

    // If no filters are applied via URL, use props
    if (filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn([[this._getPageKey()], 'filterInfo'], props.properties.pageProperties)
      if (pagePropertiesFilterInfo) {
        filterInfo = pagePropertiesFilterInfo
      }
    }

    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computePortal,
      },
      {
        id: `${this.props.routeParams.dialect_path}/Dictionary`,
        entity: this.props.computeDocument,
      },
      {
        id: `/api/v1/path/FV/${this.props.routeParams.area}/SharedData/Shared Categories/@children`,
        entity: this.props.computeCategories,
      },
    ])

    this.state = {
      filterInfo,
      visibleFilter: null,
      searchTerm: null,
      computeEntities,
      isKidsTheme: this.props.routeParams.theme === 'kids',
    }

    // Bind methods to 'this'
    ;[
      '_changeFilter',
      '_getPageKey',
      '_getURLPageProps',
      '_handleEnterSearch',
      '_handleFacetSelected',
      '_handleFilterChange',
      '_handlePagePropertiesChange',
      '_handleSearch',
      '_onNavigateRequest',
      '_resetSearch',
      '_resetURLPagination',
      '_updateSearchTerm',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const { computeEntities, filterInfo, isKidsTheme, searchTerm, visibleFilter } = this.state
    const { routeParams } = this.props

    const _computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      `${routeParams.dialect_path}/Dictionary`
    )

    const _computePortal = ProviderHelpers.getEntry(this.props.computePortal, `${routeParams.dialect_path}/Portal`)

    const _computeCategories = ProviderHelpers.getEntry(
      this.props.computeCategories,
      `/api/v1/path/FV/${routeParams.area}/SharedData/Shared Categories/@children`
    )

    const computeCategoriesSize = selectn('response.entries.length', _computeCategories) || 0

    const searchSort = searchTerm
      ? {
        DEFAULT_SORT_COL: 'ecm:fulltextScore',
        DEFAULT_SORT_TYPE: 'desc',
      }
      : {}

    const wordListView = selectn('response.uid', _computeDocument) ? (
      <WordListView
        controlViaURL
        DEFAULT_PAGE_SIZE={10}
        filter={filterInfo}
        onPaginationReset={this._resetURLPagination}
        onPagePropertiesChange={this._handlePagePropertiesChange}
        parentID={selectn('response.uid', _computeDocument)}
        renderSimpleTable
        routeParams={this.props.routeParams}
        {...this._getURLPageProps()}
        {...searchSort}
      />
    ) : (
      ''
    )

    // Render kids view

    // Or Mobile
    if (isKidsTheme || isMobile) {
      const pageSize = !isKidsTheme && isMobile ? 10 : 8

      const kidsFilter = filterInfo.setIn(['currentAppliedFilter', 'kids'], ' AND fv:available_in_childrens_archive=1')

      return (
        <PromiseWrapper renderOnError computeEntities={computeEntities}>
          <div className="row" style={{ marginTop: '15px' }}>
            <div className={classNames('col-xs-12', 'col-md-8', 'col-md-offset-2')}>
              {React.cloneElement(wordListView, {
                DEFAULT_PAGE_SIZE: pageSize,
                disablePageSize: true,
                filter: kidsFilter,
                gridListView: true,
              })}
            </div>
          </div>
        </PromiseWrapper>
      )
    }

    let searchAlertInfo = (
      <span>
        Showing <strong>all words</strong> in the dictionary <strong>listed alphabetically</strong>.
      </span>
    )

    if (filterInfo.get('currentAppliedFiltersDesc') && !filterInfo.get('currentAppliedFiltersDesc').isEmpty()) {
      const appliedFilters = ['Showing words that ']
      let i = 0

      filterInfo.get('currentAppliedFiltersDesc').map((currentValue, index, arr) => {
        appliedFilters.push(currentValue)
        if (arr.size > 1 && arr.size - 1 !== i) {
          appliedFilters.push(
            <span>
              {' '}
              <span style={{ textDecoration: 'underline' }}>AND</span>
            </span>
          )
        }
        ++i
      })

      searchAlertInfo = appliedFilters
    }

    const browseAlphabetically = React.cloneElement(
      <AlphabetListView
        pagination={false}
        routeParams={this.props.routeParams}
        dialect={selectn('response', _computePortal)}
      />,
      {
        gridListView: true,
        gridViewProps: {
          cols: 10,
          cellHeight: 25,
          action: this._changeFilter,
          style: { overflowY: 'hidden', padding: '10px' },
        },
        gridListTile: AlphabetGridTile,
      }
    )

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className={classNames('row', 'row-create-wrapper')}>
          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-8', 'text-right')}>
            <AuthorizationFilter
              filter={{
                entity: selectn('response', _computeDocument),
                login: this.props.computeLogin,
                role: ['Record', 'Approve', 'Everything'],
              }}
              hideFromSections
              routeParams={this.props.routeParams}
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
          <div className={classNames('col-xs-12', 'col-md-3', computeCategoriesSize === 0 ? 'hidden' : null)}>
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

              <RaisedButton
                style={{ width: '100%', textAlign: 'left' }}
                label={intl.trans(
                  'views.pages.explore.dialect.learn.words.find_by_category',
                  'Filter by Category',
                  'words'
                )}
                onTouchTap={this._handleFilterChange.bind(this, 'find_by_category')}
              />

              {visibleFilter === 'find_by_category' && (
                <FacetFilterListCategory
                  title={intl.trans('categories', 'Categories', 'first')}
                  appliedFilterIds={filterInfo.get('currentCategoryFilterIds')}
                  facetField={ProviderHelpers.switchWorkspaceSectionKeys(
                    'fv-word:categories',
                    this.props.routeParams.area
                  )}
                  onFacetSelected={this._handleFacetSelected}
                  facets={selectn('response.entries', _computeCategories) || []}
                />
              )}

              {intl.trans('views.pages.explore.dialect.learn.words.find_by_alphabet', 'Browse Alphabetically', 'words')}

              {browseAlphabetically}
            </div>
            {/*
              <hr />
              <div>
              <h3>More in {selectn('response.contextParameters.ancestry.dialect.dc:title', _computePortal)}</h3>

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
            */}
          </div>
          <div className={classNames('col-xs-12', computeCategoriesSize === 0 ? 'col-md-12' : 'col-md-9')}>
            <h1>
              {`${selectn('response.contextParameters.ancestry.dialect.dc:title', _computePortal) || ''} ${intl.trans(
                'words',
                'Words',
                'first'
              )}`}
            </h1>

            <SearchWordsPhrases
              handleEnterSearch={this._handleEnterSearch}
              handleSearch={this._handleSearch}
              resetSearch={this._resetSearch}
              updateSearchTerm={this._updateSearchTerm}
              searchAlertInfo={searchAlertInfo}
              searchTerm={searchTerm}
            />

            {wordListView}
          </div>
        </div>
      </PromiseWrapper>
    )
  }
  // END render

  _changeFilter(value, type, nxql) {
    if (value && value !== '') {
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

          default:
            filterDesc = null
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

      // console.log('!!! _changeFilter', newFilter.toJS())

      this.setState({ filterInfo: newFilter })
    }
  }

  _clearAllFilters() {}

  _handleEnterSearch(evt) {
    if (evt.key === 'Enter') {
      this._handleSearch()
    }
  }

  // AND dc:title LIKE 'a%'
  // "SELECT * FROM FVWord WHERE ecm:parentId = 'a9de8996-4577-419d-802d-fce139ed3f2d' AND ecm:currentLifeCycleState <> 'deleted' AND dc:title LIKE 'a%25'"
  // "SELECT * FROM FVWord WHERE ecm:parentId = 'a9de8996-4577-419d-802d-fce139ed3f2d' AND ecm:currentLifeCycleState <> 'deleted' AND ecm:fulltext = '*b*'"
  // "SELECT * FROM FVWord WHERE ecm:parentId = 'a9de8996-4577-419d-802d-fce139ed3f2d' AND ecm:currentLifeCycleState <> 'deleted' AND dc:title LIKE 'b%25'"

  // SELECT * FROM FVWord WHERE ecm:parentId = 'a9de8996-4577-419d-802d-fce139ed3f2d' AND ecm:currentLifeCycleState <> 'deleted' AND (dc:title LIKE 'b%25' OR fv-word:part_of_speech = '')

  /*
  'dc:title'
  'fv-word:part_of_speech'
  'fv-word:pronunciation'
  'fv:definitions'
  'fv:literal_translation'
  'fv:related_audio'
  'fv:related_pictures'
  'fv:related_videos'
  'fv-word:related_phrases'
  'fv-word:categories'
  'fv:cultural_note'
  'fv:reference'
  'fv:source'
  'fv:available_in_childrens_archive'
  'fv-word:available_in_games'
  */
  _handleSearch() {
    const { searchTerm } = this.state
    this._changeFilter(searchTerm, 'contains', (term) => {
      return ` AND ecm:fulltext = '*${StringHelpers.clean(term, 'fulltext')}*'`
      // return ` AND dc:title LIKE '${term}%'`
    })
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
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

  _getPageKey() {
    return this.props.routeParams.area + '_' + this.props.routeParams.dialect_name + '_learn_words'
  }

  // TODO: _resetSearch needs to also clear Alphabetical Search
  _resetSearch() {
    // TODO: Should `let newFilter = this.state.filterInfo.deleteIn(..`
    // TODO: just be `this.state.filterInfo.deleteIn(['currentAppliedFilter', 'contains'], null)`?
    let newFilter = this.state.filterInfo.deleteIn(['currentAppliedFilter', 'contains'], null)
    newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'contains'], null)

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    this._resetURLPagination()

    this.setState({ filterInfo: newFilter, searchTerm: null })
  }

  _updateSearchTerm(evt) {
    this.setState({
      searchTerm: evt.target.value,
    })
  }
}
