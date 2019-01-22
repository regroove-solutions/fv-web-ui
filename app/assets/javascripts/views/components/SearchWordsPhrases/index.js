import React, { Component } from 'react'
import { PropTypes } from 'react'
import { SEARCH_ADVANCED, SEARCH_DEFAULT, SEARCH_SORT_DEFAULT } from './constants'
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
    searchPartOfSpeech: string,
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
    searchPartOfSpeech: SEARCH_SORT_DEFAULT,
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
              <label htmlFor="searchPartOfSpeech">Part of speech:</label>
              <select onChange={this._handleCustomSearch} id="searchPartOfSpeech" name="searchPartOfSpeech">
                <option value={SEARCH_SORT_DEFAULT}>Any</option>
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
              </select>
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
    const { id, checked, value, type } = evt.target
    this.props.handleInputChange({ id, checked, value, type })
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
