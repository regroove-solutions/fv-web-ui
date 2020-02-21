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
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import selectn from 'selectn'

import { Table, TableBody, TableCell, TableRow, TableFooter, TablePagination, Chip } from '@material-ui/core'
import TablePaginationActions from './tablepagination'
import SortingHeader from './sortingheader'

import { windowLocationPathnameWithoutPagination } from 'common/NavigationHelpers'

/**
 * List view for words in immersion
 */
const { array, number, object, string } = PropTypes

function desc(a, b, orderBy) {
  if (!a[orderBy] && !b[orderBy]) {
    return 0
  }
  if (b[orderBy] > a[orderBy] || !b[orderBy]) {
    return -1
  }
  if (b[orderBy] < a[orderBy] || !a[orderBy]) {
    return 1
  }
  return 0
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

export default class ImmersionTable extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    mappedTranslations: array.isRequired,
    selectedCategory: string,
    selectedFilter: string,
  }
  static defaultProps = {
    mappedTranslations: [],
  }

  constructor(props, context) {
    super(props, context)

    const { pageNumber, pageSize } = this._getURLPageProps()

    this.state = {
      order: 'desc',
      orderBy: 'translation',
      pageNumber: pageNumber,
      pageSize: pageSize,
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  _getURLPageProps() {
    const pageProps = { pageNumber: 1, pageSize: 10 }
    const page = selectn('page', this.props.routeParams)
    const pageSize = selectn('pageSize', this.props.routeParams)

    if (page) {
      pageProps.pageNumber = parseInt(page, 10) - 1
    }
    if (pageSize) {
      pageProps.pageSize = parseInt(pageSize, 10)
    }

    return pageProps
  }

  handleChangePage = (event, pageNumber) => {
    const { pageSize } = this.state
    const newUrl =
      window.location.origin + '/' + windowLocationPathnameWithoutPagination() + '/' + pageSize + '/' + (pageNumber + 1)
    window.history.pushState({}, '', newUrl)
    this.setState({ pageNumber })
  }

  handleChangeRowsPerPage = (event) => {
    const pageSize = event.target.value
    const { pageNumber } = this.state
    const newUrl =
      window.location.origin + '/' + windowLocationPathnameWithoutPagination() + '/' + pageSize + '/' + (pageNumber + 1)
    window.history.pushState({}, '', newUrl)
    this.setState({ pageSize })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  renderTranslation = (label, type = 'base') => {
    if (label.type === 'phrase') return label[type]
    var translation = label[type]
    var count = 0
    const words = translation.split(/(%s)/g).map((word, i) => {
      if (word === '%s') {
        const chip = <Chip key={i} label={label.templateStrings[count]} />
        count++
        return chip
      } else {
        return <span key={i}>{word}</span>
      }
    })
    return words
  }

  render() {
    const { mappedTranslations, selectedCategory, selectedFilter } = this.props
    const { order, orderBy, pageNumber, pageSize } = this.state
    const emptyRows = pageSize - Math.min(pageSize, mappedTranslations.length - pageNumber * pageSize)
    const filteredTranslations = mappedTranslations
      .filter((label) => {
        if (!selectedCategory) {
          return true
        }
        return label.categoryId.startsWith(selectedCategory)
      })
      .filter((label) => {
        if (selectedFilter === 'untranslated') {
          return !label.translation
        }
        if (selectedFilter === 'translated') {
          return label.translation !== undefined
        }
        return true
      })

    return (
      <div style={{ flexShrink: 0 }}>
        <Table>
          <SortingHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
            columns={[
              { id: 'translation', label: 'Translation' },
              { id: 'base', label: 'Base' },
              { id: 'type', label: 'Type' },
              { id: 'category', label: 'Category' },
            ]}
          />
          <TableBody>
            {filteredTranslations
              .sort(getSorting(order, orderBy))
              .slice(pageNumber * pageSize, pageNumber * pageSize + pageSize)
              .map((row) => {
                return (
                  <TableRow key={row.labelKey}>
                    <TableCell>
                      {row.translation ? (
                        <>
                          {this.renderTranslation(row, 'translation')}
                          {row.editButton}
                        </>
                      ) : (
                        'UNTRANSLATED'
                      )}
                    </TableCell>
                    <TableCell>{this.renderTranslation(row, 'base')}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.category || 'UNCATEGORIZED'}</TableCell>
                  </TableRow>
                )
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={6}
                count={filteredTranslations.length}
                rowsPerPage={pageSize}
                page={pageNumber}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelDisplayedRows={({ from, to, count }) => {
                  return `Results: ${from}-${to} of ${count}`
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}
