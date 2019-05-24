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
import Immutable, { List } from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { changeTitleParams, overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { fetchBook, fetchBookEntries, updateBook, updateBookEntry } from 'providers/redux/reducers/fvBook'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'

// Models
import { Document } from 'nuxeo'

// Views
import BookEntryEdit from 'views/pages/explore/dialect/learn/songs-stories/entry/edit'
import BookEntryList from 'views/pages/explore/dialect/learn/songs-stories/entry/list-view'

import Dialog from 'material-ui/lib/dialog'

import fields from 'models/schemas/fields'
import options from 'models/schemas/options'

import withForm from 'views/hoc/view/with-form'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const DEFAULT_LANGUAGE = 'english'

const DEFAULT_SORT_ORDER = '&sortOrder=asc,asc&sortBy=fvbookentry:sort_map,dc:created'

const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object } = PropTypes
export class PageDialectBookEdit extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    book: object,
    // REDUX: reducers/state
    computeBook: object.isRequired,
    computeBookEntries: object.isRequired,
    computeDialect2: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    fetchBook: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchBookEntries: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    updateBook: func.isRequired,
    updateBookEntry: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      editPageDialogOpen: false,
      editPageItem: null,
      formValue: null,
      sortedItems: List(),
    }

    // Bind methods to 'this'
    ;['_editPage', '_pageSaved', '_storeSortOrder', '_handleSave', '_handleCancel'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
    newProps.fetchBook(this._getBookPath())
    newProps.fetchBookEntries(this._getBookPath(), DEFAULT_SORT_ORDER)
  }

  // Redirect on success
  componentWillReceiveProps(nextProps) {
    let currentBook
    let nextBook

    if (this._getBookPath() !== null) {
      currentBook = ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath())
      nextBook = ProviderHelpers.getEntry(nextProps.computeBook, this._getBookPath())
    }

    // 'Redirect' on success
    if (
      selectn('wasUpdated', currentBook) != selectn('wasUpdated', nextBook) &&
      selectn('wasUpdated', nextBook) === true
    ) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', nextBook), 'songs-stories'),
        nextProps.replaceWindowPath,
        true
      )
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  _handleSave(book, formValue) {
    const newDocument = new Document(book.response, {
      repository: book.response._repository,
      nuxeo: book.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set(formValue)

    // Save document
    this.props.updateBook(newDocument, null, null)

    this.setState({ formValue: formValue })
  }

  _handleCancel() {
    NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.pushWindowPath)
  }

  _storeSortOrder(items) {
    this.setState({
      sortedItems: items,
    })
  }

  _editPage(item) {
    this.setState({ editPageDialogOpen: true, editPageItem: item })
  }

  _getBookPath(props = null) {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.bookName)) {
      return _props.routeParams.bookName
    }
    return _props.routeParams.dialect_path + '/Stories & Songs/' + StringHelpers.clean(_props.routeParams.bookName)
  }

  _pageSaved() {
    // Ensure update is complete before re-fetch.
    setTimeout(
      function pageSavedSetTimeout() {
        this.props.fetchBookEntries(this._getBookPath(), DEFAULT_SORT_ORDER)
      }.bind(this),
      500
    )
    this.setState({ editPageDialogOpen: false, editPageItem: null })
  }

  componentDidUpdate(/*prevProps, prevState*/) {
    const book = selectn('response', ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath()))
    const title = selectn('properties.dc:title', book)
    const uid = selectn('uid', book)

    if (title && selectn('pageTitleParams.bookName', this.props.properties) != title) {
      this.props.changeTitleParams({ bookName: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.bookName' })
    }
  }

  render() {
    let context

    const computeEntities = Immutable.fromJS([
      {
        id: this._getBookPath(),
        entity: this.props.computeBook,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
      {
        id: this._getBookPath(),
        entity: this.props.computeBookEntries,
      },
    ])

    const computeBook = ProviderHelpers.getEntry(this.props.computeBook, this._getBookPath())
    const computeBookEntries = ProviderHelpers.getEntry(this.props.computeBookEntries, this._getBookPath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', computeDialect2) && selectn('response', computeBook)) {
      const providedFilter =
        selectn('response.properties.fv-phrase:definitions[0].translation', computeBook) ||
        selectn('response.properties.fv:literal_translation[0].translation', computeBook)
      context = Object.assign(selectn('response', computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', computeBook),
          providedFilter: providedFilter,
        },
      })
    }

    return (
      <div>
        <Tabs>
          <Tab label={intl.trans('book', 'Book', 'first')}>
            <h1>
              {intl.trans(
                'views.pages.explore.dialect.learn.songs_stories.edit_x_book',
                'Edit ' + selectn('response.properties.dc:title', computeBook) + ' Book',
                'words',
                [selectn('response.properties.dc:title', computeBook)]
              )}
            </h1>
            <EditViewWithForm
              computeEntities={computeEntities}
              initialValues={context}
              itemId={this._getBookPath()}
              fields={fields}
              options={options}
              saveMethod={this._handleSave}
              cancelMethod={this._handleCancel}
              currentPath={this.props.splitWindowPath}
              navigationMethod={this.props.pushWindowPath}
              type="FVBook"
              routeParams={this.props.routeParams}
            />
          </Tab>
          <Tab label={intl.trans('pages', 'Pages', 'first')}>
            <h1>
              {intl.trans('', 'Edit ' + selectn('response.properties.dc:title', computeBook) + ' pages', 'first', [
                selectn('response.properties.dc:title', computeBook),
              ])}
            </h1>
            <BookEntryList
              reorder
              sortOrderChanged={this._storeSortOrder}
              defaultLanguage={DEFAULT_LANGUAGE}
              editAction={this._editPage}
              innerStyle={{ minHeight: 'inherit' }}
              metadata={selectn('response', computeBookEntries) || {}}
              items={selectn('response.entries', computeBookEntries) || []}
            />
          </Tab>
        </Tabs>

        <Dialog
          autoScrollBodyContent
          style={{ zIndex: 0 }}
          overlayStyle={{ background: 'none' }}
          open={this.state.editPageDialogOpen}
          onRequestClose={() => this.setState({ editPageDialogOpen: false })}
        >
          <BookEntryEdit
            entry={this.state.editPageItem}
            handlePageSaved={this._pageSaved}
            dialectEntry={computeDialect2}
            {...this.props}
          />
        </Dialog>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, navigation, windowPath } = state

  const { computeBook, computeBookEntries } = fvBook
  const { computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { properties } = navigation

  return {
    computeBook,
    computeBookEntries,
    computeDialect2,
    properties,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  fetchBook,
  fetchDialect2,
  fetchBookEntries,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
  updateBook,
  updateBookEntry,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectBookEdit)
