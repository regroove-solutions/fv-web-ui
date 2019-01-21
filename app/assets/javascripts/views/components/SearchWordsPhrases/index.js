import React, { Component } from 'react'
import { PropTypes } from 'react'
import { SEARCH_DEFAULT, SEARCH_ADVANCED } from './constants'
import provide from 'react-redux-provide'

import classNames from 'classnames'
import RaisedButton from 'material-ui/lib/raised-button'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const { any, func, string, bool } = PropTypes

@provide
class SearchWordsPhrases extends Component {
  static propTypes = {
    handleEnterSearch: func,
    handleInputChange: func,
    handleSearch: func,
    resetSearch: func,
    updateSearchTerm: func,
    searchAlertInfo: any, // TODO: sometimes element, sometimes array
    searchTerm: string,
    searchType: string,
    searchPhrase: bool,
    searchWord: bool,
    searchDefinitions: bool,
    searchPartOfSpeech: bool,
  }
  static defaultProps = {
    handleInputChange: () => {},
    handleEnterSearch: () => {},
    handleSearch: () => {},
    resetSearch: () => {},
    updateSearchTerm: () => {},
    searchAlertInfo: null,
    searchTerm: '',
    searchType: SEARCH_ADVANCED,
    searchPhrase: false,
    searchWord: false,
    searchDefinitions: false,
    searchPartOfSpeech: false,
  }

  constructor(props) {
    super(props)
    ;['_handleCustomSearch', '_handleEnterSearch', '_handleSearch', '_resetSearch', '_updateSearchTerm'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  render() {
    const {
      searchAlertInfo,
      searchTerm,
      searchType,
      searchPhrase,
      searchWord,
      searchDefinitions,
      searchPartOfSpeech,
    } = this.props
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
                id="searchPhrase"
                name="searchPhrase"
                checked={searchPhrase}
                onChange={this._handleCustomSearch}
              />
              <label htmlFor="searchPhrase">Phrase</label>
            </span>
            <span>
              <input
                type="checkbox"
                id="searchWord"
                name="searchWord"
                checked={searchWord}
                onChange={this._handleCustomSearch}
              />
              <label htmlFor="searchWord">Word</label>
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
                id="searchPartOfSpeech"
                name="searchPartOfSpeech"
                checked={searchPartOfSpeech}
                onChange={this._handleCustomSearch}
              />
              <label htmlFor="searchPartOfSpeech">Part of speech</label>
            </span>
          </div>
        </div>

        {searchAlertInfo && <div className={classNames('alert', 'alert-info')}>{searchAlertInfo}</div>}
      </div>
    )
  }

  _updateSearchTerm(evt) {
    this.props.updateSearchTerm(evt)
  }
  _handleCustomSearch(evt) {
    const { searchTerm } = this.props
    const { id, checked } = evt.target
    const search = searchTerm || ''
    /*
    if (name === 'searchType' && id === 'searchAll') {
      console.log('reset search to standard', id, name)
    } else {
      console.log('need to set custom fields', id, name)
    }
    */
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
    // const nql = `AND ecm:fulltext='*f*'&currentPageIndex=0&pageSize=10&sortOrder=asc&sortBy=ecm:fulltextScore` // NOTE: dev query
    // const nql = ` AND ( dc:title ILIKE 'b%' AND fv-word:part_of_speech = 'basic')&currentPageIndex=0&pageSize=250&sortOrder=asc&sortBy=dc:title` // NOTE: dev query
    // const nql = " AND ( dc:title ILIKE 'b%' OR fv-word:part_of_speech = 'basic')&currentPageIndex=0&pageSize=250&sortOrder=asc&sortBy=fv-word:part_of_speech"  // NOTE: dev query
    const nxqlFields = {
      searchPhrase: `dc:title ILIKE '${search}%'`, // TODO: confirm dc:title when searching phrase
      searchWord: `dc:title ILIKE '${search}%'`,
      searchDefinitions: `fv:definitions ILIKE '${search}%'`, // TODO: confirm ILIKE instead of alternates like `=`,
      searchPartOfSpeech: `fv-word:part_of_speech = '${search}%'`, // TODO: does ILIKE work instead?
    }
    this.props.handleInputChange(id, checked)
  }
  _handleEnterSearch(evt) {
    this.props.handleEnterSearch(evt)
  }

  _handleSearch() {
    this.props.handleSearch()
  }
  _resetSearch() {
    this.props.resetSearch()
  }
}

export { SearchWordsPhrases }
