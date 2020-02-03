/* Copyright 2016 First People's Cultural Council

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

import React from 'react'
import PropTypes from 'prop-types'
import Immutable, { Set, Map, is } from 'immutable'

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCategories } from 'providers/redux/reducers/fvCategory'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import { SEARCH_PART_OF_SPEECH_ANY, SEARCH_BY_CATEGORY } from 'views/components/SearchDialect/constants'
import DialectFilterList from 'views/components/DialectFilterList'
// import IntlService from 'views/services/intl'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'
import NavigationHelpers from 'common/NavigationHelpers'
import { withTheme } from '@material-ui/core/styles'

// Immersion specific
import ImmersionListView from 'views/pages/explore/dialect/immersion/list-view'

// const intl = IntlService.instance

const { array, bool, func, object } = PropTypes
class PageDialectImmersionList extends PageDialectLearnBase {
  static propTypes = {
    hasPagination: bool,
    routeParams: object.isRequired,
    // // REDUX: reducers/state
    computeCategories: object.isRequired,
    computeDocument: object.isRequired,
    // computeLogin: object.isRequired,
    computePortal: object.isRequired,
    computeSearchDialect: object,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // windowPath: string.isRequired,
    // // REDUX: actions/dispatch/func
    fetchCategories: func.isRequired,
    fetchDocument: func.isRequired,
    fetchPortal: func.isRequired,
    // overrideBreadcrumbs: func.isRequired,
    pushWindowPath: func.isRequired,
    // replaceWindowPath: func.isRequired,
    searchDialectUpdate: func,
    // updatePageProperties: func.isRequired,
  }
  static defaultProps = {
    searchDialectUpdate: () => {},
  }

  DIALECT_FILTER_TYPE = 'immersion'

  /*
    TODO add shared categories for immersion specific (Shared Categories)
    Dictionary -> Dictionary with label or some other document type?
  */

  constructor(props, context) {
    super(props, context)

    let filterInfo = this.initialFilterInfo()
    // If no filters are applied via URL, use props
    if (filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn([[this._getPageKey()], 'filterInfo'], props.properties.pageProperties)
      if (pagePropertiesFilterInfo) {
        filterInfo = pagePropertiesFilterInfo
      }
    }

    const computeEntities = Immutable.fromJS([
      {
        id: props.routeParams.dialect_path,
        entity: props.computePortal,
      },
      {
        id: `${props.routeParams.dialect_path}/Dictionary`,
        entity: props.computeDocument,
      },
      {
        id: `/api/v1/path/FV/${props.routeParams.area}/SharedData/Shared Categories/@children`,
        entity: props.computeCategories,
      },
    ])

    this.state = {
      computeEntities,
      filterInfo,
    }

    // Bind methods to 'this'
    ;[
      '_getURLPageProps', // NOTE: Comes from PageDialectLearnBase
      '_handleFacetSelected', // NOTE: Comes from PageDialectLearnBase
      '_handleFilterChange', // NOTE: Comes from PageDialectLearnBase
      '_handlePagePropertiesChange', // NOTE: Comes from PageDialectLearnBase
      '_onNavigateRequest', // NOTE: Comes from PageDialectLearnBase
      '_resetURLPagination', // NOTE: Comes from PageDialectLearnBase
      'handleDialectFilterList', // NOTE: Comes from PageDialectLearnBase
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // NOTE: PageDialectLearnBase calls `_getPageKey`
  _getPageKey = () => {
    return `${this.props.routeParams.area}_${this.props.routeParams.dialect_name}_immersion`
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
  // TODOSL REPLACE THESE PATHS
  fetchData(newProps) {
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary')
    newProps.fetchCategories('/api/v1/path/FV/' + newProps.routeParams.area + '/SharedData/Shared Categories/@children')
  }

  handleCategoryClick = async ({ facetField, selected, unselected, href }, updateHistory = true) => {
    await this.props.searchDialectUpdate({
      searchByAlphabet: '',
      searchByMode: SEARCH_BY_CATEGORY,
      searchingDialectFilter: selected.checkedFacetUid,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchTerm: '',
    })

    this.changeFilter({ href, updateHistory })

    this.handleDialectFilterList(facetField, selected, unselected, this.DIALECT_FILTER_TYPE)
  }

  handleSearch = () => {
    this.changeFilter()
  }

  resetSearch = () => {
    let newFilter = this.state.filterInfo
    // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'], null)
    newFilter = newFilter.set('currentAppliedFilter', new Map())

    // newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'categories'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'contains'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'startsWith'], null)
    newFilter = newFilter.set('currentAppliedFiltersDesc', new Map())

    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    this.setState(
      {
        filterInfo: newFilter,
        // searchNxqlSort: 'fv:custom_order', // TODO: IS THIS BREAKING SOMETHING?
      },
      () => {
        // When facets change, pagination should be reset.
        // In these pages (words/phrase), list views are controlled via URL
        this._resetURLPagination()

        // Remove alphabet/category filter urls
        if (selectn('routeParams.category', this.props) || selectn('routeParams.letter', this.props)) {
          let resetUrl = `/${this.props.splitWindowPath.join('/')}`
          const _splitWindowPath = [...this.props.splitWindowPath]
          const learnIndex = _splitWindowPath.indexOf('learn')
          if (learnIndex !== -1) {
            _splitWindowPath.splice(learnIndex + 2)
            resetUrl = `/${_splitWindowPath.join('/')}`
          }

          NavigationHelpers.navigate(resetUrl, this.props.pushWindowPath, false)
        }
      }
    )
  }

  // FILTERS
  initialFilterInfo = () => {
    const routeParamsCategory = this.props.routeParams.category
    const initialCategories = routeParamsCategory ? new Set([routeParamsCategory]) : new Set()
    const currentAppliedFilterCategoriesParam1 = ProviderHelpers.switchWorkspaceSectionKeys(
      'fv-word:categories',
      this.props.routeParams.area
    )
    const currentAppliedFilterCategories = routeParamsCategory
      ? ` AND ${currentAppliedFilterCategoriesParam1}/* IN ("${routeParamsCategory}")`
      : ''

    return new Map({
      currentCategoryFilterIds: initialCategories,
      currentAppliedFilter: new Map({
        categories: currentAppliedFilterCategories,
      }),
    })
  }

  changeFilter = ({ href, updateUrl = true } = {}) => {
    const { searchByMode, searchNxqlQuery } = this.props.computeSearchDialect
    let searchType
    let newFilter = this.state.filterInfo

    switch (searchByMode) {
      case SEARCH_BY_CATEGORY: {
        searchType = 'categories'
        // Remove other settings
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'], null)
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'], null)
        break
      }
      default: {
        searchType = 'contains'
        // Remove other settings
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'], null)
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'], null)
        // newFilter = newFilter.set('currentCategoryFilterIds', new Set())
      }
    }

    // Remove all old settings...
    newFilter = newFilter.set('currentAppliedFilter', new Map())
    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    // Add new search query
    newFilter = newFilter.updateIn(['currentAppliedFilter', searchType], () => {
      return searchNxqlQuery && searchNxqlQuery !== '' ? ` AND ${searchNxqlQuery}` : ''
    })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (is(this.state.filterInfo, newFilter) === false) {
      this.setState({ filterInfo: newFilter }, () => {
        // NOTE: `_resetURLPagination` below can trigger FW-256:
        // "Back button is not working properly when paginating within alphabet chars
        // (Navigate to /learn/words/alphabet/a/1/1 - go to page 2, 3, 4. Use back button.
        // You will be sent to the first page)"
        //
        // The above test (`is(...) === false`) prevents updates triggered by back or forward buttons
        // and any other unnecessary updates (ie: the filter didn't change)
        this._resetURLPagination({ preserveSearch: true })

        // See about updating url
        if (href && updateUrl) {
          NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
        }
      })
    }
  }

  clearDialectFilter = () => {
    this.setState({ filterInfo: this.initialFilterInfo() })
  }

  render() {
    const { computeEntities, filterInfo } = this.state

    const { routeParams } = this.props
    const computeDocument = ProviderHelpers.getEntry(
      this.props.computeDocument,
      `${routeParams.dialect_path}/Dictionary`
    )

    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, `${routeParams.dialect_path}/Portal`)

    const computeCategories = ProviderHelpers.getEntry(
      this.props.computeCategories,
      `/api/v1/path/FV/${routeParams.area}/SharedData/Shared Categories/@children`
    )
    const computeCategoriesSize = selectn('response.entries.length', computeCategories) || 1 // 0

    const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) ||
      ''} Immersion Portal` // TODOSL add localization tag

    const { searchNxqlSort = {} } = this.props.computeSearchDialect
    const { DEFAULT_SORT_COL, DEFAULT_SORT_TYPE } = searchNxqlSort
    const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = this._getURLPageProps() // via base > pulled from routeParams

    const wordListView = selectn('response.uid', computeDocument) ? (
      <ImmersionListView
        controlViaURL
        DEFAULT_PAGE={DEFAULT_PAGE}
        DEFAULT_PAGE_SIZE={DEFAULT_PAGE_SIZE}
        DEFAULT_SORT_COL={DEFAULT_SORT_COL}
        DEFAULT_SORT_TYPE={DEFAULT_SORT_TYPE}
        disableClickItem={false}
        filter={filterInfo}
        flashcard={false}
        flashcardTitle={pageTitle}
        parentID={selectn('response.uid', computeDocument)}
        routeParams={this.props.routeParams}
        // Search:
        handleSearch={this.handleSearch}
        resetSearch={this.resetSearch}
        hasSearch
        searchUi={[
          {
            defaultChecked: true,
            idName: 'searchByTitle',
            labelText: 'Word',
          },
          {
            idName: 'searchByDefinitions',
            labelText: 'Definitions',
          },
        ]}
      />
    ) : null

    const dialectClassName = getDialectClassname(computePortal)

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className="row">
          <div
            className={classNames('col-xs-12', 'col-md-3', computeCategoriesSize === 0 ? 'hidden' : null, 'PrintHide')}
          >
            <div>TODOSL Filter by whether word is translated or not yet TODO HERE</div>
            <div>
              <DialectFilterList
                type={this.DIALECT_FILTER_TYPE}
                title={'Browse Section Categories'}
                appliedFilterIds={filterInfo.get('currentCategoryFilterIds')}
                facetField={ProviderHelpers.switchWorkspaceSectionKeys(
                  'fv-word:categories',
                  this.props.routeParams.area
                )}
                handleDialectFilterClick={this.handleCategoryClick}
                handleDialectFilterList={this.handleDialectFilterList} // NOTE: Comes from PageDialectLearnBase
                facets={selectn('response.entries', computeCategories) || []}
                clearDialectFilter={this.clearDialectFilter}
                routeParams={this.props.routeParams}
              />
            </div>
          </div>
          <div className={classNames('col-xs-12', computeCategoriesSize === 0 ? 'col-md-12' : 'col-md-9')}>
            <h1 className="DialectPageTitle">{pageTitle}</h1>
            <div className={dialectClassName}>{wordListView}</div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
  // END render
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, navigation, fvPortal, fvCategory, searchDialect, windowPath } = state

  const { properties } = navigation
  const { computeCategories } = fvCategory
  const { computeDocument } = document
  const { computePortal } = fvPortal
  const { computeSearchDialect } = searchDialect
  const { splitWindowPath, _windowPath } = windowPath
  return {
    properties,
    computePortal,
    computeCategories,
    computeDocument,
    computeSearchDialect,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
  fetchDocument,
  fetchPortal,
  pushWindowPath,
  searchDialectUpdate,
}

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(PageDialectImmersionList))
