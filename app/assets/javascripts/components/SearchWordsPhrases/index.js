import React, { Component } from 'react'
import { PropTypes } from 'react'

import provide from 'react-redux-provide'

import classNames from 'classnames'
import RaisedButton from 'material-ui/lib/raised-button'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const { any, func, string } = PropTypes

@provide
class SearchWordsPhrases extends Component {
  static propTypes = {
    handleEnterSearch: func,
    handleSearch: func,
    resetSearch: func,
    updateSearchTerm: func,
    searchAlertInfo: any, // TODO: sometimes element, sometimes array
    searchTerm: string,
  }
  static defaultProps = {
    handleEnterSearch: () => {},
    handleSearch: () => {},
    resetSearch: () => {},
    updateSearchTerm: () => {},
    searchAlertInfo: null,
    searchTerm: '',
  }

  constructor(props) {
    super(props)
    ;['_handleEnterSearch', '_handleSearch', '_resetSearch', '_updateSearchTerm'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  render() {
    const { searchAlertInfo, searchTerm } = this.props
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
              <input type="radio" name="searchType" id="searchAll" />
              <label htmlFor="searchAll">Search all fields</label>
            </span>
            <span>
              <input type="radio" name="searchType" id="searchAdvanced" />
              <label htmlFor="searchAdvanced">Advanced Search</label>
            </span>

            <span>
              <input type="checkbox" id="searchPhrase" />
              <label htmlFor="searchPhrase">Phrase</label>
            </span>
            <span>
              <input type="checkbox" id="searchWord" />
              <label htmlFor="searchWord">Word</label>
            </span>
            <span>
              <input type="checkbox" id="searchDefinitions" />
              <label htmlFor="searchDefinitions">Definitions</label>
            </span>
            <span>
              <input type="checkbox" id="searchPartOfSpeech" />
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
