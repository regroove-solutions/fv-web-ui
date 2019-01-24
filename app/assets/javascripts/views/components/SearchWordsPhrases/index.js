import React, { Component } from 'react'
import Immutable, { Set, Map } from 'immutable'
import { PropTypes } from 'react'
import { SEARCH_ADVANCED, SEARCH_DEFAULT, SEARCH_SORT_DEFAULT } from './constants'
import provide from 'react-redux-provide'
import StringHelpers from 'common/StringHelpers'

import classNames from 'classnames'
import RaisedButton from 'material-ui/lib/raised-button'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const { any, func, string, bool } = PropTypes

@provide
class SearchWordsPhrases extends Component {
  static propTypes = {
    filterInfo: any, // TODO: set appropriate propType
    updateStatePageDialectLearnWords: func,
    // ^ new
    handleSearch: func,
    resetSearch: func,
    searchAlphabet: bool,
    searchTerm: string,
    searchType: string,
    searchTitleText: string,
    searchTitle: bool,
    searchDefinitions: bool,
    searchTranslations: bool,
    searchPartOfSpeech: string,
  }
  static defaultProps = {
    filterInfo: new Map({}),
    updateStatePageDialectLearnWords: () => {},
    // ^ new
    handleSearch: () => {},
    resetSearch: () => {},
    searchAlphabet: false,
    searchTerm: '',
    searchType: SEARCH_ADVANCED,
    searchTitle: false,
    searchDefinitions: false,
    searchTranslations: false,
    searchPartOfSpeech: SEARCH_SORT_DEFAULT,
  }

  constructor(props) {
    super(props)
    ;[
      '_getSearchInfo',
      '_generateNxql',
      '_getNxqlSearchSort',
      '_getNxqlBoolCount',
      '_handleCustomSearch',
      '_handleEnterSearch',
      '_handleSearch',
      '_resetSearch',
      '_updateSearchTerm',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  componentDidUpdate() {
    const searchNxqlQuery = this._generateNxql()
    const searchNxqlSort = this._getNxqlSearchSort()
    this.props.updateStatePageDialectLearnWords({ searchNxqlQuery, searchNxqlSort })
  }

  render() {
    const {
      searchTerm,
      searchType,
      searchTitle,
      searchTitleText,
      searchDefinitions,
      searchTranslations,
      searchPartOfSpeech,
    } = this.props

    const searchInfoOutput = this._getSearchInfo()

    return (
      <div>
        <div>
          <input
            type="text"
            onChange={this._updateSearchTerm}
            onKeyPress={this._handleEnterSearch}
            value={searchTerm}
          />{' '}
          <RaisedButton
            label={intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')}
            onTouchTap={this._handleSearch}
            primary
          />{' '}
          <RaisedButton
            label={intl.trans('views.pages.explore.dialect.learn.words.reset_search', 'Clear Search', 'words')}
            onTouchTap={this._resetSearch}
            primary={false}
          />
          <div>
            <span>
              <input
                type="radio"
                name="searchType"
                id={SEARCH_DEFAULT}
                checked={searchType === SEARCH_DEFAULT}
                onChange={this._handleCustomSearch}
                value={SEARCH_DEFAULT}
              />
              <label htmlFor={SEARCH_DEFAULT}>Search all fields</label>
            </span>
            <span>
              <input
                type="radio"
                name="searchType"
                id={SEARCH_ADVANCED}
                checked={searchType === SEARCH_ADVANCED}
                onChange={this._handleCustomSearch}
                value={SEARCH_ADVANCED}
              />
              <label htmlFor={SEARCH_ADVANCED}>Advanced Search</label>
            </span>

            <span>
              <input
                type="checkbox"
                id="searchTitle"
                name="searchTitle"
                checked={searchTitle}
                onChange={this._handleCustomSearch}
              />
              <label htmlFor="searchTitle">{searchTitleText}</label>
            </span>
            <span>
              <input
                type="checkbox"
                id="searchDefinitions"
                name="searchDefinitions"
                checked={searchDefinitions}
                onChange={this._handleCustomSearch}
              />
              <label htmlFor="searchDefinitions">Definitions</label>
            </span>
            <span>
              <input
                type="checkbox"
                id="searchTranslations"
                name="searchTranslations"
                checked={searchTranslations}
                onChange={this._handleCustomSearch}
              />
              <label htmlFor="searchTranslations">Literal Translations</label>
            </span>
            <span>
              <label htmlFor="searchPartOfSpeech">Part of speech:</label>
              <select
                onChange={this._handleCustomSearch}
                id="searchPartOfSpeech"
                name="searchPartOfSpeech"
                value={searchPartOfSpeech}
              >
                <option value={SEARCH_SORT_DEFAULT}>Any</option>
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
              </select>
            </span>
          </div>
        </div>

        {searchInfoOutput}
      </div>
    )
  }
  _getSearchInfo() {
    const { filterInfo } = this.props
    let searchInfo = (
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

      searchInfo = appliedFilters
    }

    return <div className={classNames('alert', 'alert-info')}>{searchInfo}</div>
  }

  _getNxqlSearchSort() {
    const { searchAlphabet, searchPartOfSpeech, searchTerm } = this.props
    // Default sort
    let searchSortBy = 'ecm:fulltextScore'

    if (searchAlphabet) {
      searchSortBy = 'dc:title'
    } else {
      const boolCount = this._getNxqlBoolCount()
      if (boolCount > 0) {
        searchSortBy = 'dc:title'
      }
      if (boolCount === 1 && searchPartOfSpeech) {
        searchSortBy = 'fv-word:part_of_speech'
      }
    }

    return searchTerm
      ? {
        DEFAULT_SORT_COL: searchSortBy,
        DEFAULT_SORT_TYPE: 'asc',
      }
      : {}
  }
  _getNxqlBoolCount() {
    const { searchDefinitions, searchTranslations, searchPartOfSpeech, searchTitle } = this.props

    const check = {
      searchDefinitions,
      searchTranslations,
      searchPartOfSpeech: searchPartOfSpeech !== SEARCH_SORT_DEFAULT,
      searchTitle,
    }
    const boolCount = check.searchTitle + check.searchDefinitions + check.searchTranslations + check.searchPartOfSpeech
    return boolCount
  }
  _generateNxql() {
    const {
      searchTerm,
      searchType,
      searchTitle,
      searchAlphabet,
      searchDefinitions,
      searchTranslations,
      searchPartOfSpeech,
    } = this.props

    const search = searchTerm || ''
    const nxqlTmpl = {
      allFields: `ecm:fulltext = '*${StringHelpers.clean(search, 'fulltext')}*'`,
      searchTitle: `dc:title ILIKE '%${search}%'`,
      searchAlphabet: `dc:title ILIKE '${search}%'`,
      searchDefinitions: `fv:definitions/*/translation ILIKE '%${search}%'`,
      searchTranslations: `fv:literal_translation/*/translation ILIKE '%${search}%'`,
      searchPartOfSpeech: `fv-word:part_of_speech = '${searchPartOfSpeech}'`,
    }

    const nxqlQueries = []
    let nxqlQuerySpeech = ''
    const nxqlQueryJoin = (nxq, join = ' OR ') => {
      if (nxq.length >= 1) {
        nxq.push(join)
      }
    }
    if (searchType === SEARCH_ADVANCED) {
      /* if (searchAlphabet) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(`${nxqlTmpl.searchAlphabet}`)
      } */
      if (searchTitle) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(`${nxqlTmpl.searchTitle}`)
      }
      if (searchTranslations) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(`${nxqlTmpl.searchTranslations}`)
      }
      if (searchDefinitions) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(`${nxqlTmpl.searchDefinitions}`)
      }
      if (searchPartOfSpeech && searchPartOfSpeech !== SEARCH_SORT_DEFAULT) {
        if (!searchTitle && search) {
          nxqlQueryJoin(nxqlQueries)
          nxqlQueries.push(`${nxqlTmpl.searchTitle}`)
        }
        nxqlQuerySpeech = `${nxqlQueries.length > 0 ? ' AND ' : ''} ${nxqlTmpl.searchPartOfSpeech}`
      }
    } else {
      if (searchAlphabet) {
        nxqlQueries.push(`${nxqlTmpl.searchAlphabet}`)
      } else {
        nxqlQueries.push(`${nxqlTmpl.allFields}`)
      }
    }
    let nxqlQueryCollection = ''
    if (nxqlQueries.length > 0) {
      nxqlQueryCollection = `( ${nxqlQueries.join('')} )`
    }
    // this.props.updateNxqlQuery(`${nxqlQueryCollection}${nxqlQuerySpeech}`)
    // this.props.updateStatePageDialectLearnWords({ searchNxqlQuery: `${nxqlQueryCollection}${nxqlQuerySpeech}` })
    return `${nxqlQueryCollection}${nxqlQuerySpeech}`
  }
  _handleCustomSearch(evt) {
    const { id, checked, value, type } = evt.target

    const updateState = {}
    // NOTE: Scripting here is tied to the structure of the html

    // Record changes
    switch (type) {
      case 'checkbox':
        updateState[id] = checked
        break
      case 'radio':
        updateState.searchType = id
        break
      default:
        updateState[id] = value
    }

    this.props.updateStatePageDialectLearnWords(updateState)
  }

  _handleEnterSearch(evt) {
    if (evt.key === 'Enter') {
      this.props.handleSearch()
    }
  }

  _handleSearch() {
    this.props.handleSearch()
  }
  _resetSearch() {
    this.props.resetSearch()
  }

  _updateSearchTerm(evt) {
    this.props.updateStatePageDialectLearnWords({
      searchTerm: evt.target.value,
    })
  }
}

export { SearchWordsPhrases }
