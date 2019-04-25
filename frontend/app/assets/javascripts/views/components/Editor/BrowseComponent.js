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
// import { Immutable, Map } from 'immutable'

import provide from 'react-redux-provide'
import selectn from 'selectn'
// import t from 'tcomb-form'
// import classNames from 'classnames'

// import ProviderHelpers from 'common/ProviderHelpers'
// import StringHelpers from 'common/StringHelpers'

import { Dialog /*, FlatButton, RaisedButton*/ } from 'material-ui'
// import GridTile from 'material-ui/lib/grid-list/grid-tile'

// import MediaList from 'views/components/Browsing/media-list'
// import LinearProgress from 'material-ui/lib/linear-progress'

// import IconButton from 'material-ui/lib/icon-button'
// import ActionInfo from 'material-ui/lib/svg-icons/action/info'
// import ActionInfoOutline from 'material-ui/lib/svg-icons/action/info-outline'

import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view'
import WordListView from 'views/pages/explore/dialect/learn/words/list-view'
import CategoriesListView from 'views/pages/explore/dialect/learn/words/categories-list-view'
import ContributorsListView from 'views/pages/explore/dialect/learn/base/contributors-list-view'
import LinksListView from 'views/pages/explore/dialect/learn/base/links-list-view'
import IntlService from 'views/services/intl'

// const gridListStyle = { width: '100%', height: '100vh', overflowY: 'auto', marginBottom: 10 }
const intl = IntlService.instance
const DefaultFetcherParams = {
  currentPageIndex: 1,
  pageSize: 10,
  filters: { 'properties.dc:title': { appliedFilter: '' }, dialect: { appliedFilter: '' } },
}

export class BrowseComponent extends Component {
  static propTypes = {
    onComplete: PropTypes.func.isRequired,
    fetchSharedPictures: PropTypes.func.isRequired,
    computeSharedPictures: PropTypes.object.isRequired,
    fetchResources: PropTypes.func.isRequired,
    computeResources: PropTypes.object.isRequired,
    fetchSharedAudios: PropTypes.func.isRequired,
    computeSharedAudios: PropTypes.object.isRequired,
    fetchSharedVideos: PropTypes.func.isRequired,
    computeSharedVideos: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
    dialect: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    containerType: PropTypes.string,
    disabled: PropTypes.boolean,
  }
  static defaultProps = {
    disabled: false,
  }

  constructor(props) {
    super(props)

    // If initial filter value provided
    const providedTitleFilter = selectn('otherContext.providedFilter', this.props.dialect)
    const appliedParams = providedTitleFilter
      ? Object.assign({}, DefaultFetcherParams, {
          filters: { 'properties.dc:title': { appliedFilter: providedTitleFilter } },
        })
      : DefaultFetcherParams

    this.state = {
      open: false,
      fetcherParams: appliedParams,
    }
  }

  render() {
    const dialect = this.props.dialect
    const dialectPath = selectn('path', dialect)

    const actions = [
      // <FlatButton label={intl.trans('cancel', 'Cancel', 'first')} secondary onTouchTap={this._handleClose} />,
      <button key="action1" onClick={this._handleClose} type="button">
        {intl.trans('cancel', 'Cancel', 'first')}
      </button>,
    ]

    let title = ''
    let view = null

    switch (this.props.type) {
      case 'FVPhrase':
        title = 'Select existing phrases from ' + selectn('properties.dc:title', dialect) + ' dialect:'
        view = (
          <PhraseListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            routeParams={{
              theme: 'explore',
              dialect_path: dialectPath,
            }}
          />
        )
        break

      case 'FVCategory':
        title = `${intl.trans('select', 'Select', 'first')} ${
          this.props.containerType == 'FVWord'
            ? intl.trans('categories', 'Categories', 'first')
            : intl.trans('phrase_books', 'Phrase Books', 'words')
        }`
        view = (
          <CategoriesListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            categoriesPath={
              this.props.containerType == 'FVWord'
                ? '/FV/Workspaces/SharedData/Shared Categories/'
                : dialectPath + '/Phrase Books/'
            }
            routeParams={{
              theme: 'explore',
              area: 'Workspaces',
              dialect_path: dialectPath,
            }}
          />
        )
        break

      case 'FVContributor':
        title = `${intl.trans(
          'select_contributors_from_x_dialect',
          'Select contributors from ' + selectn('properties.dc:title', dialect) + ' dialect',
          'first',
          [selectn('properties.dc:title', dialect)]
        )}:`
        view = (
          <ContributorsListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            routeParams={{
              theme: 'explore',
              area: 'Workspaces',
              dialect_path: dialectPath,
            }}
          />
        )
        break

      case 'FVLink':
        title = `${intl.trans(
          'select_links_from_x_dialect',
          'Select links from ' + selectn('properties.dc:title', dialect) + ' dialect',
          'first',
          [selectn('properties.dc:title', dialect)]
        )}:`
        view = (
          <LinksListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            routeParams={{
              theme: 'explore',
              area: 'Workspaces',
              dialect_path: dialectPath,
            }}
          />
        )
        break

      case 'FVWord':
        title = `${intl.trans(
          'select_existing_words_from_x_dialect',
          'Select existing words from ' + selectn('properties.dc:title', dialect) + ' dialect',
          'first',
          [selectn('properties.dc:title', dialect)]
        )}:`
        view = (
          <WordListView
            action={this._handleSelectElement}
            useDatatable
            dialect={dialect}
            routeParams={{
              theme: 'explore',
              dialect_path: dialectPath,
            }}
          />
        )
        break
      default: // Note: do nothing
    }

    return (
      <div style={{ display: 'inline' }}>
        <button type="button" disabled={this.props.disabled} onClick={this._handleOpen}>
          {this.props.label}
        </button>
        <Dialog
          title={title}
          actions={actions}
          modal
          contentStyle={{ width: '80%', height: '80vh', maxWidth: '100%' }}
          autoScrollBodyContent
          open={this.state.open}
        >
          {(() => {
            if (dialectPath) {
              return view
            }
          })()}
        </Dialog>
      </div>
    )
  }

  _handleOpen = () => {
    this.setState({ open: true })
  }

  _handleClose = () => {
    this.setState({ open: false })
  }

  _handleSelectElement = (value) => {
    this.props.onComplete(value, () => {
      this._handleClose()
    })
  }
}
export default provide(BrowseComponent)
