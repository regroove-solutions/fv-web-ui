import React, { Component } from 'react'
import { PropTypes } from 'react'
import classNames from 'classnames'
import RaisedButton from 'material-ui/lib/raised-button'
import IntlService from 'views/services/intl'
const intl = IntlService.instance
const { any, func, string } = PropTypes

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
        </div>

        {searchAlertInfo && <div className={classNames('alert', 'alert-info')}>{searchAlertInfo}</div>}
      </div>
    )
  }

  _updateSearchTerm(evt) {
    this.props.updateSearchTerm(evt)
  }
  _handleEnterSearch(evt) {
    // TODO: when hit enter searchAlertInfo is an array?
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
