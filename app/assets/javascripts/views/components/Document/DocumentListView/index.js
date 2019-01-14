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
// import classNames from 'classnames'
import selectn from 'selectn'
import DataGrid from 'react-datagrid'

import GridView from 'views/pages/explore/dialect/learn/base/grid-view'
import DictionaryList from 'views/components/Browsing/dictionary-list'

import ClearFix from 'material-ui/lib/clearfix'
import Paper from 'material-ui/lib/paper'

import withPagination from 'views/hoc/grid-list/with-pagination'
import IntlService from 'views/services/intl'

// is TapEvent needed here?! Test on mobile
//var injectTapEventPlugin = require("react-tap-event-plugin");
//injectTapEventPlugin();

// Stylesheet
import '!style-loader!css-loader!react-datagrid/dist/index.min.css'

const GridViewWithPagination = withPagination(GridView, 8)

function debounce(a, b, c) {
  var d, e // eslint-disable-line
  // eslint-disable-next-line
  return function() {
    function h() {
      ;(d = null), c || (e = a.apply(f, g)) // eslint-disable-line
    }

    var f = this // eslint-disable-line

    var g = arguments // eslint-disable-line
    return (
      clearTimeout(d), (d = setTimeout(h, b)), c && !d && (e = a.apply(f, g)), e
    ) // eslint-disable-line
  }
}

const DefaultFetcherParams = {
  currentPageIndex: 1,
  pageSize: 10,
  sortBy: 'fv:custom_order',
  sortOrder: 'asc',
}
const FilteredPaginatedDictionaryList = withPagination(
  DictionaryList,
  DefaultFetcherParams.pageSize
)

export default class DocumentListView extends Component {
  static propTypes = {
    columns: PropTypes.any, // TODO: set appropriate propType
    data: PropTypes.any, // TODO: set appropriate propType
    dialect: PropTypes.any, // TODO: set appropriate propType
    disablePageSize: PropTypes.any, // TODO: set appropriate propType
    gridCols: PropTypes.any, // TODO: set appropriate propType
    gridListTile: PropTypes.any, // TODO: set appropriate propType
    gridListView: PropTypes.any, // TODO: set appropriate propType
    gridViewProps: PropTypes.any, // TODO: set appropriate propType
    onSelectionChange: PropTypes.func,
    onSortChange: PropTypes.any, // TODO: set appropriate propType
    page: PropTypes.number,
    pageSize: PropTypes.number,
    pagination: PropTypes.bool,
    refetcher: PropTypes.func,
    renderSimpleTable: PropTypes.any, // TODO: set appropriate propType
    sortInfo: PropTypes.any, // TODO: set appropriate propType
    type: PropTypes.any, // TODO: set appropriate propType
    usePrevResponse: PropTypes.bool,
  }

  static defaultProps = {
    data: {},
    pagination: true,
    usePrevResponse: false,
    onSelectionChange: () => {},
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedId: null,
    }

    // Bind methods to 'this'
    // eslint-disable-next-line
    ;[
      '_handleSelectionChange',
      '_onPageChange',
      '_onPageSizeChange',
      '_gridListFetcher',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  intl = IntlService.instance

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        page: 1,
      })
    }
  }

  render() {
    const {
      columns,
      data,
      dialect,
      disablePageSize,
      gridCols,
      gridListTile,
      gridListView,
      gridViewProps,
      onSortChange,
      pagination,
      page,
      pageSize,
      renderSimpleTable,
      sortInfo,
      type,
    } = this.props

    // Styles
    const DataGridStyles = {
      minHeight: '70vh',
      zIndex: 0,
    }

    let _gridViewProps = {
      style: { overflowY: 'auto', maxHeight: '50vh' },
      cols: gridCols,
      cellHeight: 160,
      fetcher: this._gridListFetcher,
      type: type,
      pagination: pagination,
      fetcherParams: { currentPageIndex: page, pageSize: pageSize },
      metadata: selectn('response', data),
      gridListTile: gridListTile,
      disablePageSize: disablePageSize,
      dialect: dialect,
      items: selectn('response.entries', data),
    }

    if (gridListView) {
      _gridViewProps = Object.assign({}, _gridViewProps, gridViewProps)

      if (pagination) {
        return <GridViewWithPagination {..._gridViewProps} />
      }
      return <GridView {..._gridViewProps} />
    }

    if (renderSimpleTable) {
      return (
        <FilteredPaginatedDictionaryList {...gridViewProps} columns={columns} />
      )
    }

    return (
      <Paper>
        <ClearFix>
          <DataGrid
            idProperty="uid"
            dataSource={selectn('response.entries', data)}
            dataSourceCount={selectn('response.totalSize', data)}
            columns={columns}
            rowHeight={55}
            style={DataGridStyles}
            selected={this.state.selectedId}
            onSelectionChange={this._handleSelectionChange}
            onSortChange={onSortChange}
            withColumnMenu={false}
            pagination={pagination}
            paginationToolbarProps={{
              showRefreshIcon: false,
              pageSizes: [10, 20, 50],
            }}
            sortInfo={sortInfo}
            page={page}
            pageSize={pageSize}
            onPageChange={this._onPageChange}
            onPageSizeChange={this._onPageSizeChange}
            emptyText={this.intl.trans('no_records', 'No records', 'words')}
            showCellBorders
          />
        </ClearFix>
      </Paper>
    )
  }

  _gridListFetcher(fetcherParams) {
    this.props.refetcher(
      this.props,
      fetcherParams.currentPageIndex,
      fetcherParams.pageSize
    )
  }

  _handleSelectionChange(newSelectedId, data) {
    this.setState({
      selectedId: newSelectedId,
    })

    this.props.onSelectionChange(data)
  }

  _onPageChange = debounce((page) => {
    // Skip if page hasn't actually changed.
    if (page === this.props.page) {
      return
    }

    this.setState({
      page: page,
    })

    this.props.refetcher(this.props, page, this.props.pageSize)
  }, 750)

  _onPageSizeChange(pageSize) {
    // Skip if page size hasn't actually changed
    if (pageSize === this.props.pageSize) {
      return
    }

    let newPage = this.props.page

    if (pageSize > this.props.pageSize) {
      // TODO: use selectn for this.props.data.response.totalSize?
      newPage = Math.min(
        this.props.page,
        Math.ceil(this.props.data.response.totalSize / pageSize)
      )
    }

    // Refresh data
    this.props.refetcher(this.props, newPage, pageSize)
  }
}
