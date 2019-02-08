import React, { Component } from 'react'
import Immutable, { Set, Map } from 'immutable'
import { PropTypes } from 'react'
import { SEARCH_ADVANCED, SEARCH_DEFAULT, SEARCH_SORT_DEFAULT } from './constants'
import provide from 'react-redux-provide'
import StringHelpers from 'common/StringHelpers'
import selectn from 'selectn'
import classNames from 'classnames'
import RaisedButton from 'material-ui/lib/raised-button'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const { any, func, string, bool, object } = PropTypes

@provide
class SearchDialect extends Component {
  static propTypes = {
    computeDirectory: object.isRequired,
    fetchDirectory: func.isRequired,
    filterInfo: any, // TODO: set appropriate propType
    handleSearch: func,
    isSearchingPhrases: bool,
    resetButtonText: string,
    resetSearch: func,
    searchButtonText: string,
    searchByAlphabet: bool,
    searchByDefinitions: bool,
    searchByTitle: bool,
    searchByTranslations: bool,
    searchByCulturalNotes: bool,
    searchPartOfSpeech: string,
    searchTerm: string,
    updateAncestorState: func,
  }
  static defaultProps = {
    isSearchingPhrases: false,
    filterInfo: new Map({}),
    updateAncestorState: () => {},
    handleSearch: () => {},
    resetSearch: () => {},
    searchByAlphabet: false,
    searchByCulturalNotes: false,
    searchByTitle: true,
    searchByDefinitions: true,
    searchByTranslations: false,
    searchTerm: '',
    searchPartOfSpeech: SEARCH_SORT_DEFAULT,
  }

  constructor(props) {
    super(props)

    this.state = {
      partsOfSpeechOptions: null,
      searchInfoOutput: this._getSearchInfo(),
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

  componentDidMount() {
    this.props.fetchDirectory('parts_of_speech')
  }

  componentDidUpdate(prevProps) {
    const searchNxqlQuery = this._generateNxql()
    const searchNxqlSort = this._getNxqlSearchSort()
    this.props.updateAncestorState({ searchNxqlQuery, searchNxqlSort })

    const prevComputeSuccess = selectn('computeDirectory.success', prevProps)
    const currentComputeSuccess = selectn('computeDirectory.success', this.props)
    if (prevComputeSuccess !== currentComputeSuccess && currentComputeSuccess === true) {
      const _partsOfSpeech = selectn('computeDirectory.directories.parts_of_speech', this.props)
      const _partsOfSpeechSort = _partsOfSpeech.sort((a, b) => {
        if (a.text < b.text) return -1
        if (a.text > b.text) return 1
        return 0
      })

      let partsOfSpeechOptions = null
      const _partsOfSpeechOptions = _partsOfSpeechSort.map((part, index) => {
        return (
          <option key={index} value={part.value}>
            {part.text}
          </option>
        )
      })

      if (_partsOfSpeechOptions.length > 0) {
        partsOfSpeechOptions = [
          <option key="SEARCH_SORT_DIVIDER" disabled>
            ─────────────
          </option>,
          ..._partsOfSpeechOptions,
        ]
      }

      // Note: aware that we are triggering a new render
      // eslint-disable-next-line
      this.setState({ partsOfSpeechOptions })
    }

    if (prevProps.searchByAlphabet !== this.props.searchByAlphabet && this.props.searchByAlphabet === true) {
      // Note: aware that we are triggering a new render
      // eslint-disable-next-line
      this.setState({
        searchInfoOutput: this._getSearchInfo(),
      })
    }
  }

  render() {
    const {
      isSearchingPhrases,
      searchTerm,
      searchByCulturalNotes,
      searchByTitle,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props
    let searchButtonText = ''
    const resetButtonText = 'Reset search'
    let searchByTitleText = ''
    if (isSearchingPhrases) {
      searchByTitleText = 'Phrase'
      searchButtonText = 'Search'
    } else {
      searchByTitleText = 'Word'
      searchButtonText = intl.trans('views.pages.explore.dialect.learn.words.search_words', 'Search Words', 'words')
    }

    const _css = 'SearchDialect'
    return (
      <div className={`${_css}`}>
        {this.state.searchInfoOutput}
        <div className={`${_css}Form`}>
          <div className={`${_css}FormPrimary`}>
            <input
              className={`${_css}FormPrimaryInput`}
              type="text"
              onChange={this._updateSearchTerm}
              onKeyPress={this._handleEnterSearch}
              value={searchTerm}
            />

            <RaisedButton label={searchButtonText} onTouchTap={this._handleSearch} primary />

            <RaisedButton
              label={resetButtonText}
              onTouchTap={this._resetSearch}
              primary={false}
              style={{ marginLeft: '20px' }}
            />
          </div>

          <div className={`${_css}FormSecondary`}>
            <span className={`${_css}FormSecondaryGroup`}>
              <input
                checked={searchByTitle}
                className={`${_css}Option`}
                id="searchByTitle"
                name="searchByTitle"
                onChange={this._handleCustomSearch}
                type="checkbox"
              />
              <label className={`${_css}Label`} htmlFor="searchByTitle">
                {searchByTitleText}
              </label>
            </span>

            <span className={`${_css}FormSecondaryGroup`}>
              <input
                checked={searchByDefinitions}
                className={`${_css}Option`}
                id="searchByDefinitions"
                name="searchByDefinitions"
                onChange={this._handleCustomSearch}
                type="checkbox"
              />
              <label className={`${_css}Label`} htmlFor="searchByDefinitions">
                Definitions
              </label>
            </span>

            {isSearchingPhrases && (
              <span className={`${_css}FormSecondaryGroup`}>
                <input
                  checked={searchByCulturalNotes}
                  className={`${_css}Option`}
                  id="searchByCulturalNotes"
                  name="searchByCulturalNotes"
                  onChange={this._handleCustomSearch}
                  type="checkbox"
                />
                <label className={`${_css}Label`} htmlFor="searchByCulturalNotes">
                  Cultural notes
                </label>
              </span>
            )}

            {isSearchingPhrases !== true && (
              <span className={`${_css}FormSecondaryGroup`}>
                <input
                  checked={searchByTranslations}
                  className={`${_css}Option`}
                  id="searchByTranslations"
                  name="searchByTranslations"
                  onChange={this._handleCustomSearch}
                  type="checkbox"
                />
                <label className={`${_css}Label`} htmlFor="searchByTranslations">
                  Literal translations
                </label>
              </span>
            )}

            {isSearchingPhrases !== true && (
              <span className={`${_css}FormSecondaryGroup`}>
                <label className={`${_css}Label`} htmlFor="searchPartOfSpeech">
                  Parts of speech:
                </label>
                <select
                  className={`${_css}Option ${_css}PartsOfSpeech`}
                  id="searchPartOfSpeech"
                  name="searchPartOfSpeech"
                  onChange={this._handleCustomSearch}
                  value={searchPartOfSpeech}
                >
                  <option key="SEARCH_SORT_DEFAULT" value={SEARCH_SORT_DEFAULT}>
                    Any
                  </option>
                  {isSearchingPhrases === false && this.state.partsOfSpeechOptions}
                </select>
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  _getSearchInfo() {
    // TODO: IMPROVE SEARCH MESSAGES
    const {
      isSearchingPhrases,
      searchByAlphabet,
      searchByCulturalNotes,
      searchByDefinitions,
      searchTerm,
      searchByTitle,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props

    // Showing all words in the dictionary listed alphabetically.

    // Showing words that start with the letter d

    // Showing words that contain the search term 'd'
    // Showing words that contain the search term 'd' in the 'Word' column
    // Showing words that contain the search term 'd' in the 'Definitions' column
    // Showing words that contain the search term 'd' in the 'Literal translations' column
    // Showing words that contain the search term 'd' in the 'Word' and 'Definitions' columns
    // Showing words that contain the search term 'd' in the 'Word' and 'Literal translations' columns
    // Showing words that contain the search term 'd' in the 'Definitions' and 'Literal translations' columns

    // Showing words that contain the search term 'd', filtered by the selected 'Parts of speech'
    // Showing words that contain the search term 'd' in the 'Word' column, filtered by the selected 'Parts of speech'
    // Showing words that contain the search term 'd' in the 'Definitions' column, filtered by the selected 'Parts of speech'
    // Showing words that contain the search term 'd' in the 'Literal translations' column, filtered by the selected 'Parts of speech'
    // Showing words that contain the search term 'd' in the 'Word' and 'Definitions' columns, filtered by the selected 'Parts of speech'
    // Showing words that contain the search term 'd' in the 'Word' and 'Literal translations' columns, filtered by the selected 'Parts of speech'
    // Showing words that contain the search term 'd' in the 'Definitions' and 'Literal translations' columns, filtered by the selected 'Parts of speech'
    const wordsOrPhrases = isSearchingPhrases ? 'phrases' : 'words'

    let msg = ''
    if (searchByAlphabet) {
      msg = (
        <span>
          Showing all {wordsOrPhrases} that start with the letter <strong>{searchTerm}</strong>
        </span>
      )
    } else {
      let searchingCol = ''
      const colCount = searchByCulturalNotes + searchByDefinitions + searchByTitle + searchByTranslations
      if (colCount === 1) {
        let colSearched = ''
        if (searchByTitle) {
          colSearched = isSearchingPhrases ? 'Phrase' : 'Word'
        }
        if (searchByDefinitions) {
          colSearched = 'Definitions'
        }
        if (searchByCulturalNotes) {
          colSearched = 'Cultural Notes'
        }
        if (searchByTranslations) {
          colSearched = 'Literal translations'
        }
        searchingCol = ` in the '${colSearched}' column`
      }
      if (colCount >= 2) {
        const _colsSearched = []
        if (searchByTitle) {
          _colsSearched.push(isSearchingPhrases ? "'Phrase'" : "'Word'")
        }
        if (searchByDefinitions) {
          _colsSearched.push("'Definitions'")
        }

        if (searchByCulturalNotes) {
          _colsSearched.push("'Cultural Notes'")
        }
        if (searchByTranslations) {
          _colsSearched.push("'Literal translations'")
        }
        const lastCol = _colsSearched.pop()
        searchingCol = ` in the ${_colsSearched.join(', ')} and ${lastCol} columns`
      }

      const searchingPartsOfSpeech =
        searchPartOfSpeech !== SEARCH_SORT_DEFAULT ? ", filtered by the selected 'Parts of speech'" : ''
      let msgPrefix = null
      if (searchTerm === '' || searchTerm === null) {
        msgPrefix = <span>{`Showing all ${wordsOrPhrases} found`}</span>
      } else {
        msgPrefix = (
          <span>
            {`Showing ${wordsOrPhrases} that contain the search term '`}
            <strong>{searchTerm}</strong>
            {"' found"}
          </span>
        )
      }
      msg = (
        <span>
          {msgPrefix}
          {searchingCol}
          {searchingPartsOfSpeech}
        </span>
      )
    }
    return <div className={classNames('SearchDialectSearchFeedback', 'alert', 'alert-info')}>{msg}</div>
    /*
    const { filterInfo, isSearchingPhrases } = this.props

    let searchInfo = isSearchingPhrases ? (
      <span key="SearchInfoPhrasesDefault">
        Showing <strong>all phrases</strong> in the phrase books <strong>listed alphabetically</strong>.
      </span>
    ) : (
      <span key="SearchInfoWordsDefault">
        Showing <strong>all words</strong> in the dictionary <strong>listed alphabetically</strong>.
      </span>
    )

    if (filterInfo.get('currentAppliedFiltersDesc') && !filterInfo.get('currentAppliedFiltersDesc').isEmpty()) {
      const appliedFilters = []
      appliedFilters.push(
        isSearchingPhrases ? (
          <span key="SearchInfoAppliedFiltersPhrases">Showing phrases that </span>
        ) : (
          <span key="SearchInfoAppliedFiltersWords">Showing words that </span>
        )
      )

      let i = 0

      filterInfo.get('currentAppliedFiltersDesc').forEach((currentValue, index, arr) => {
        //
        appliedFilters.push(<span key={`SearchInfoAppliedFiltersDesc${index}`}>{currentValue}</span>)

        if (arr.size > 1 && arr.size - 1 !== i) {
          appliedFilters.push(
            <span key={`SearchInfoAppliedFiltersDescDivider${index}`}>
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
    */
  }

  _getNxqlSearchSort() {
    const { searchPartOfSpeech, searchTerm } = this.props
    // Default sort
    let searchSortBy = 'dc:title'

    const boolCount = this._getNxqlBoolCount()
    // if (boolCount > 0) {
    //   searchSortBy = 'dc:title'
    // }
    if (boolCount === 1 && searchPartOfSpeech) {
      searchSortBy = 'fv-word:part_of_speech'
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
      searchByTitle,
      searchByAlphabet,
      searchByCulturalNotes,
      searchByDefinitions,
      searchByTranslations,
      searchPartOfSpeech,
    } = this.props

    const search = searchTerm || ''
    const nxqlTmpl = {
      // allFields: `ecm:fulltext = '*${StringHelpers.clean(search, 'fulltext')}*'`,
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

    if (searchByAlphabet) {
      nxqlQueries.push(`${nxqlTmpl.searchByAlphabet}`)
    } else {
      if (searchByCulturalNotes) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(nxqlTmpl.searchByCulturalNotes)
      }
      if (searchByTitle) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(nxqlTmpl.searchByTitle)
      }
      if (searchByTranslations) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(nxqlTmpl.searchByTranslations)
      }
      if (searchByDefinitions) {
        nxqlQueryJoin(nxqlQueries)
        nxqlQueries.push(nxqlTmpl.searchByDefinitions)
      }
      if (searchPartOfSpeech && searchPartOfSpeech !== SEARCH_SORT_DEFAULT) {
        if (!searchByTitle && search) {
          nxqlQueryJoin(nxqlQueries)
          nxqlQueries.push(nxqlTmpl.searchByTitle)
        }
        // nxqlQuerySpeech = `${nxqlQueries.length > 0 ? ' AND ' : ''} ${nxqlTmpl.searchPartOfSpeech}`
        nxqlQuerySpeech = ` AND ${nxqlTmpl.searchPartOfSpeech}`
      }
    }

    // Safety
    if (nxqlQueries.length === 0) {
      nxqlQueries.push(nxqlTmpl.searchByTitle)
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

    // Record changes
    switch (type) {
      case 'checkbox':
        updateState[id] = checked
        break
      default:
        updateState[id] = value
    }

    this.props.updateAncestorState(updateState)
  }

  _handleEnterSearch(evt) {
    if (evt.key === 'Enter') {
      this.props.handleSearch()
    }
  }

  _handleSearch() {
    this.setState({
      searchInfoOutput: this._getSearchInfo(),
    })
    const updateState = { searchByAlphabet: false }
    this.props.updateAncestorState(updateState)
    this.props.handleSearch()
  }

  async _resetSearch() {
    const updateState = {
      searchTerm: null,
      searchByAlphabet: false,
      searchByCulturalNotes: false,
      searchByTitle: true,
      searchByDefinitions: true,
      searchByTranslations: false,
      searchPartOfSpeech: SEARCH_SORT_DEFAULT,
    }
    await this.props.updateAncestorState(updateState)
    this.setState({
      searchInfoOutput: this._getSearchInfo(),
    })
    this.props.resetSearch()
  }

  _updateSearchTerm(evt) {
    this.props.updateAncestorState({
      searchTerm: evt.target.value,
    })
  }
}

export { SearchDialect }
