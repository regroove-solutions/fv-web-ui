import React, { Component } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import NavigationHelpers from 'common/NavigationHelpers'

const { any, array, func, string } = PropTypes

export class ImmersionFilterList extends Component {
  static propTypes = {
    categories: array.isRequired,
    title: string.isRequired,
    routeParams: any,
    // REDUX: reducers/state
    splitWindowPath: array,
    // REDUX: actions/dispatch/func
    pushWindowPath: func.isRequired,
  }

  static defaultProps = {
    title: 'Categories',
    categories: [],
  }

  filtersSorted = []
  // intl = IntlService.instance
  title = ''

  styleListItemParent = {
    fontSize: '13px',
    fontWeight: 'normal',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '10px',
    marginBottom: 0,
    display: 'flex',
    alignItems: 'center',
  }

  styleListItemChild = {
    fontSize: '13px',
    fontWeight: 'normal',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginBottom: 0,
    display: 'flex',
    alignItems: 'center',
  }

  _isMounted = false

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this._isMounted = true

    if (this.props.categories && this.props.categories.length > 0) {
      this.filtersSorted = this._sortFilters(this.props.categories)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.categories.length !== this.props.categories.length) {
      this.filtersSorted = this._sortFilters(this.props.categories)
    }
  }

  render() {
    return (
      <div className="DialectFilterList" data-testid="DialectFilterList">
        <h2>{this.title}</h2>
        <ul className="DialectFilterListList DialectFilterListList--root">list of categories</ul>
      </div>
    )
  }

  _sortChildren(filter) {
    var children = [...filter.children]
    if (children.length > 0) {
      children.sort(this._sortByTitle)
      children = children.map((child) => {
        return this._sortChildren(child)
      })
    }
    filter.children = children
    return filter
  }

  _sortByTitle(a, b) {
    if (a.label > b.label) return -1
    if (a.label < b.label) return 1
    return 0
  }

  _sortFilters(filters) {
    const _filters = [...filters]
    // Sort root level
    _filters.sort(this._sortByTitle)
    const _filtersSorted = _filters.map((filter) => {
      // Sort children
      var children = [...filter.children]
      if (children.length > 0) {
        children.sort(this._sortByTitle)
        children = children.map((child) => {
          return this._sortChildren(child)
        })
      }
      filter.children = children
      return filter
    })
    return _filtersSorted
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { windowPath } = state

  const { splitWindowPath } = windowPath

  return {
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
}

export default connect(mapStateToProps, mapDispatchToProps)(ImmersionFilterList)
