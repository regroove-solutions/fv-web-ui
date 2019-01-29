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
class SearchDialect extends Component {
  static propTypes = {
    isSearchingPhrases: bool,
    searchButtonText: string,
    resetButtonText: string,
    filterInfo: any, // TODO: set appropriate propType
    updateAncestorState: func,
    handleSearch: func,
    resetSearch: func,
    searchByAlphabet: bool,
    searchByCulturalNotes: bool,
    searchTerm: string,
    searchType: string,
    searchByTitle: bool,
    searchByDefinitions: bool,
    searchByTranslations: bool,
    searchPartOfSpeech: string,
  }
  static defaultProps = {
    isSearchingPhrases: false,
    filterInfo: new Map({}),
    updateAncestorState: () => {},
    handleSearch: () => {},
    resetSearch: () => {},
    searchByAlphabet: false,
    searchByCulturalNotes: false,
    searchByTitle: false,
    searchByDefinitions: false,
    searchByTranslations: false,
    searchTerm: '',
    searchType: SEARCH_ADVANCED,
    searchPartOfSpeech: SEARCH_SORT_DEFAULT,
  }

  constructor(props) {
    super(props)

    this.state = {
      userInteractedWithSearchDialectAdvanced: false,
    }
    ;[
      '_getSearchInfo',
      '_getNxqlSearchSort',
      '_getNxqlBoolCount',
      '_generateNxql',
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
    this.props.updateAncestorState({ searchNxqlQuery, searchNxqlSort })
  }

  render() {
    const {
      isSearchingPhrases,
      searchTerm,
      searchType,
      searchByCulturalNotes,
      searchByTitle,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props
    const searchInfoOutput = this._getSearchInfo()

    let searchButtonText = ''
    const resetButtonText = 'Reset search'
    // resetButtonText = intl.trans('views.pages.explore.dialect.learn.words.reset_search', 'Clear Search', 'words')
    let searchByTitleText = ''
    if (isSearchingPhrases) {
      searchByTitleText = 'Phrases'
      searchButtonText = 'Search'
    } else {
      searchByTitleText = 'Words'
      searchButtonText = intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')
    }
    const disableButtons = searchTerm === '' || searchTerm === null
    return (
      <div className="SearchDialect">
        <div
          className={classNames({
            SearchDialectDisplayAdvanced: this.state.userInteractedWithSearchDialectAdvanced,
          })}
        >
          <div className="SearchDialectMain">
            <input
              className="SearchDialectMainInput"
              type="text"
              onChange={this._updateSearchTerm}
              onKeyPress={this._handleEnterSearch}
              value={searchTerm}
            />

            <RaisedButton
              className="SearchDialectMainBtn"
              disabled={disableButtons}
              label={searchButtonText}
              onTouchTap={this._handleSearch}
              primary
            />

            <RaisedButton
              className="SearchDialectMainBtn SearchDialectMainBtnReset"
              disabled={disableButtons}
              label={resetButtonText}
              onTouchTap={this._resetSearch}
              primary={false}
              style={{ marginLeft: '20px' }}
            />
          </div>

          <div className="SearchDialectMode">
            <span className="SearchDialectModeSet">
              <input
                checked={searchType === SEARCH_DEFAULT}
                className="SearchDialectModeOption"
                id={SEARCH_DEFAULT}
                name="searchType"
                onChange={this._handleCustomSearch}
                type="radio"
                value={SEARCH_DEFAULT}
              />
              <label className="SearchDialectModeLabel" htmlFor={SEARCH_DEFAULT}>
                Search all fields
              </label>
            </span>

            <span className="SearchDialectModeSet">
              <input
                checked={searchType === SEARCH_ADVANCED}
                className="SearchDialectModeOption"
                id={SEARCH_ADVANCED}
                name="searchType"
                onChange={this._handleCustomSearch}
                type="radio"
                value={SEARCH_ADVANCED}
              />
              <label className="SearchDialectModeLabel" htmlFor={SEARCH_ADVANCED}>
                Advanced search
              </label>
            </span>
          </div>

          <div className="SearchDialectAdvanced">
            <span className="SearchDialectAdvancedSet">
              <input
                checked={searchByTitle}
                className="SearchDialectAdvancedOption"
                id="searchByTitle"
                name="searchByTitle"
                onChange={this._handleCustomSearch}
                type="checkbox"
              />
              <label className="SearchDialectAdvancedLabel" htmlFor="searchByTitle">
                {searchByTitleText}
              </label>
            </span>

            <span className="SearchDialectAdvancedSet">
              <input
                checked={searchByDefinitions}
                className="SearchDialectAdvancedOption"
                id="searchByDefinitions"
                name="searchByDefinitions"
                onChange={this._handleCustomSearch}
                type="checkbox"
              />
              <label className="SearchDialectAdvancedLabel" htmlFor="searchByDefinitions">
                Definitions
              </label>
            </span>

            {isSearchingPhrases && (
              <span className="SearchDialectAdvancedSet">
                <input
                  checked={searchByCulturalNotes}
                  className="SearchDialectAdvancedOption"
                  id="searchByCulturalNotes"
                  name="searchByCulturalNotes"
                  onChange={this._handleCustomSearch}
                  type="checkbox"
                />
                <label className="SearchDialectAdvancedLabel" htmlFor="searchByCulturalNotes">
                  Cultural notes
                </label>
              </span>
            )}

            {isSearchingPhrases === false && (
              <span className="SearchDialectAdvancedSet">
                <input
                  checked={searchByTranslations}
                  className="SearchDialectAdvancedOption"
                  id="searchByTranslations"
                  name="searchByTranslations"
                  onChange={this._handleCustomSearch}
                  type="checkbox"
                />
                <label className="SearchDialectAdvancedLabel" htmlFor="searchByTranslations">
                  Literal translations
                </label>
              </span>
            )}

            {isSearchingPhrases === false && (
              <span className="SearchDialectAdvancedSet">
                <label className="SearchDialectAdvancedLabel" htmlFor="searchPartOfSpeech">
                  Parts of speech:
                </label>
                <select
                  className="SearchDialectAdvancedOption SearchDialectAdvancedPartsOfSpeech"
                  id="searchPartOfSpeech"
                  name="searchPartOfSpeech"
                  onChange={this._handleCustomSearch}
                  value={searchPartOfSpeech}
                >
                  <option value={SEARCH_SORT_DEFAULT}>Any</option>
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                </select>
              </span>
            )}
          </div>
        </div>

        {searchInfoOutput}
      </div>
    )
  }

  _getSearchInfo() {
    const { filterInfo, isSearchingPhrases } = this.props

    let searchInfo = isSearchingPhrases ? (
      <span>
        Showing <strong>all phrases</strong> in the phrase books <strong>listed alphabetically</strong>.
      </span>
    ) : (
      <span>
        Showing <strong>all words</strong> in the dictionary <strong>listed alphabetically</strong>.
      </span>
    )

    if (filterInfo.get('currentAppliedFiltersDesc') && !filterInfo.get('currentAppliedFiltersDesc').isEmpty()) {
      const appliedFilters = isSearchingPhrases ? ['Showing phrases that '] : ['Showing words that ']
      let i = 0

      filterInfo.get('currentAppliedFiltersDesc').map((currentValue, index, arr) => {
        appliedFilters.push(currentValue)
        if (arr.size > 1 && arr.size - 1 !== i) {
          appliedFilters.push(
            <span>
              {' '}
              <span style={{ textDecoration: 'underline' }}>AND</span>{' '}
            </span>
          )
        }
        ++i
      })

      searchInfo = appliedFilters
    }

    return <div className={classNames('SearchDialectSearchFeedback', 'alert', 'alert-info')}>{searchInfo}</div>
  }

  _getNxqlSearchSort() {
    const { searchByAlphabet, searchPartOfSpeech, searchTerm } = this.props
    // Default sort
    let searchSortBy = 'ecm:fulltextScore'

    if (searchByAlphabet) {
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
    const {
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
      searchByTitle,
    } = this.props

    const check = {
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech: searchPartOfSpeech !== SEARCH_SORT_DEFAULT,
      searchByTitle,
    }
    const boolCount =
      check.searchByTitle +
      check.searchByDefinitions +
      check.searchByTranslations +
      check.searchPartOfSpeech +
      check.searchByCulturalNotes
    return boolCount
  }

  _generateNxql() {
    const {
      searchTerm,
      searchType,
      searchByTitle,
      searchByAlphabet,
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props

    const search = searchTerm || ''
    const nxqlTmpl = {
      allFields: `ecm:fulltext = '*${StringHelpers.clean(search, 'fulltext')}*'`,
      searchByTitle: `dc:title ILIKE '%${search}%'`,
      searchByAlphabet: `dc:title ILIKE '${search}%'`,
      searchByCulturalNotes: `fv:cultural_note ILIKE '%${search}%'`,
      searchByDefinitions: `fv:definitions/*/translation ILIKE '%${search}%'`,
      searchByTranslations: `fv:literal_translation/*/translation ILIKE '%${search}%'`,
      searchPartOfSpeech: `fv-word:part_of_speech = '${searchPartOfSpeech}'`,
    }

    const nxqlQueries = []
    let nxqlQuerySpeech = ''
    const nxqlQueryJoin = (nxq, join = ' OR ') => {
      if (nxq.length >= 1) {
        nxq.push(join)
      }
    }
    const boolCount = this._getNxqlBoolCount()
    if (searchType === SEARCH_ADVANCED && boolCount !== 0) {
      /* if (searchByAlphabet) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(`${nxqlTmpl.searchByAlphabet}`)
      } */
      if (searchByCulturalNotes) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(`${nxqlTmpl.searchByCulturalNotes}`)
      }
      if (searchByTitle) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(`${nxqlTmpl.searchByTitle}`)
      }
      if (searchByTranslations) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(`${nxqlTmpl.searchByTranslations}`)
      }
      if (searchByDefinitions) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(`${nxqlTmpl.searchByDefinitions}`)
      }
      if (searchPartOfSpeech && searchPartOfSpeech !== SEARCH_SORT_DEFAULT) {
        if (!searchByTitle && search) {
          nxqlQueryJoin(nxqlQueries)
          nxqlQueries.push(`${nxqlTmpl.searchByTitle}`)
        }
        nxqlQuerySpeech = `${nxqlQueries.length > 0 ? ' AND ' : ''} ${nxqlTmpl.searchPartOfSpeech}`
      }
    } else {
      if (searchByAlphabet) {
        nxqlQueries.push(`${nxqlTmpl.searchByAlphabet}`)
      } else {
        nxqlQueries.push(`${nxqlTmpl.allFields}`)
      }
    }
    let nxqlQueryCollection = ''
    if (nxqlQueries.length > 0) {
      nxqlQueryCollection = `( ${nxqlQueries.join('')} )`
    }
    return `${nxqlQueryCollection}${nxqlQuerySpeech}`
  }

  _handleCustomSearch(evt) {
    const { id, checked, value, type } = evt.target

    const updateState = {}
    // always reset alphabet search
    updateState.searchByAlphabet = false

    if (value === SEARCH_DEFAULT) {
      // Reset everything
      updateState.searchType = SEARCH_DEFAULT

      updateState.searchByCulturalNotes = false
      updateState.searchByTitle = false
      updateState.searchByDefinitions = false
      updateState.searchByTranslations = false
      updateState.searchPartOfSpeech = SEARCH_SORT_DEFAULT
    } else {
      this.setState({ userInteractedWithSearchDialectAdvanced: true })
      updateState.searchType = SEARCH_ADVANCED
      // Record changes
      switch (type) {
        case 'checkbox':
          updateState[id] = checked
          break
        default:
          updateState[id] = value
      }
    }

    this.props.updateAncestorState(updateState)
  }

  _handleEnterSearch(evt) {
    if (evt.key === 'Enter') {
      this.props.handleSearch()
    }
  }

  _handleSearch() {
    const updateState = {searchByAlphabet: false}
    this.props.updateAncestorState(updateState)
    this.props.handleSearch()
  }

  _resetSearch() {
    const updateState = {
      searchTerm: null,
      searchType: SEARCH_DEFAULT,
      searchByAlphabet: false,
      searchByCulturalNotes: false,
      searchByTitle: false,
      searchByDefinitions: false,
      searchByTranslations: false,
      searchPartOfSpeech: SEARCH_SORT_DEFAULT,
    }
    this.props.updateAncestorState(updateState)
    this.props.resetSearch()
  }

  _updateSearchTerm(evt) {
    this.props.updateAncestorState({
      searchTerm: evt.target.value,
    })
  }
}

export { SearchDialect }
