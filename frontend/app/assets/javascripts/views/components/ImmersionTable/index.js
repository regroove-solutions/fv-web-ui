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

import { Table, TableBody, TableCell, TableRow, TableFooter, TablePagination, Chip } from '@material-ui/core'
import TablePaginationActions from './tablepagination'
import SortingHeader from './sortingheader'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

/**
 * List view for words in immersion
 */
const { array } = PropTypes

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
    mappedTranslations: array.isRequired,
  }
  static defaultProps = {
    mappedTranslations: [],
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      pageNumber: 0,
      pageSize: 10,
      order: 'desc',
      orderBy: 'translation',
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  handleChangePage = (event, pageNumber) => {
    this.setState({ pageNumber })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ pageSize: event.target.value })
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
    const { mappedTranslations } = this.props
    const { pageSize, pageNumber, order, orderBy } = this.state
    const emptyRows = pageSize - Math.min(pageSize, mappedTranslations.length - pageNumber * pageSize)
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
            {mappedTranslations
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
                count={mappedTranslations.length}
                rowsPerPage={pageSize}
                page={pageNumber}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    )
  }
}
