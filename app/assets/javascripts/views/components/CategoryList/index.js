import React, { Component, PropTypes } from 'react'
import Immutable, { Set } from 'immutable'

import RaisedButton from 'material-ui/lib/raised-button'
import memoize from 'memoize-one'
import selectn from 'selectn'

import { debounce } from 'debounce'
import Paper from 'material-ui/lib/paper'
import ListUI from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Checkbox from 'material-ui/lib/checkbox'
import withToggle from 'views/hoc/view/with-toggle'
import IntlService from 'views/services/intl'
const FiltersWithToggle = withToggle()

export default class CategoryList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    facets: PropTypes.array.isRequired,
    onFacetSelected: PropTypes.func.isRequired,
    facetField: PropTypes.string.isRequired,
    appliedFilterIds: PropTypes.instanceOf(Set),
    styles: PropTypes.object,
  }

  static defaultProps = {
    facets: [],
  }

  _css = 'CategoryList'
  categoriesSorted = []
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

  styleListItemCheckbox = {
    position: 'relative',
    top: 0,
    left: 0,
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

  constructor(props, context) {
    super(props, context)

    this.state = {
      disableAll: false,
    }

    // console.time('_sortCategories')
    this.categoriesSorted = this._sortCategories(props.facets)
    // console.timeEnd('_sortCategories')
    // console.time('_categoryTitlesIntl')
    // const intlCategories = this._categoryTitlesIntl(this.categoriesSorted)
    // console.timeEnd('_categoryTitlesIntl')
    // console.time('_generateListItems')
    this.listItems = this._generateListItems(this.categoriesSorted)
    // console.timeEnd('_generateListItems')

    this.title = props.title
    ;['_sortCategories', '_sortByTitle', '_clearCategoryFilter', '_toggleCheckbox'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  componentDidUpdate(prevProps) {
    const prevAppliedFilterIds = prevProps.appliedFilterIds
    const currentAppliedFilterIds = this.props.appliedFilterIds

    if (prevAppliedFilterIds.equals(currentAppliedFilterIds) === false) {
      // console.time('componentDidUpdate _generateListItems')
      this.listItems = this._generateListItems(this.categoriesSorted)
      // console.timeEnd('componentDidUpdate _generateListItems')
    }
    if (prevProps.title !== this.props.title) {
      this.title = this.props.title
    }
  }

  render() {
    const appliedFilterIdCount = this.props.appliedFilterIds.count()
    return (
      <div>
        <RaisedButton
          disabled={appliedFilterIdCount === 0}
          style={{ margin: '0 0 10px 0' }}
          label={appliedFilterIdCount > 1 ? 'Clear Category Filters' : 'Clear Category Filter'}
          onTouchTap={this._clearCategoryFilter}
        />
        <FiltersWithToggle className="panel-category" label={this.title} mobileOnly style={this.props.styles}>
          <Paper style={{ maxHeight: '70vh', overflow: 'auto' }}>
            <ListUI>{this.listItems}</ListUI>
          </Paper>
        </FiltersWithToggle>
      </div>
    )
  }

  // _categoryTitlesIntl(categories) {
  //   const _categories = [...categories]
  //   _categories.forEach((category) => {
  //     // Note: Original fn() didn't searchAndReplace root titles
  //     // category.title = this.intl.searchAndReplace(category.title)
  //     const children = selectn('contextParameters.children.entries', category)
  //     if (children.length > 0) {
  //       children.forEach((categoryChild) => {
  //         // Note: This is slow!
  //         categoryChild.title = this.intl.searchAndReplace(categoryChild.title)
  //       })
  //     }
  //   })
  //   return _categories
  // }

  _generateListItems = (categories) => {
    const { appliedFilterIds } = this.props
    const _categories = categories.map((category) => {
      const uidParent = category.uid
      const childrenItems = []
      const childrenUids = []
      const children = selectn('contextParameters.children.entries', category)
      if (children.length > 0) {
        children.forEach((categoryChild) => {
          const uidChild = categoryChild.uid
          childrenUids.push(uidChild)
          const checkedChild = appliedFilterIds.includes(uidChild)
          const childLeftCheckbox = (
            <Checkbox
              disabled={this.disableAll}
              checked={checkedChild}
              onCheck={() => {
                this._toggleCheckbox(uidChild, null, !checkedChild, uidParent)
              }}
              style={this.styleListItemCheckbox}
            />
          )
          const childListItem = (
            <ListItem
              disabled={this.disableAll}
              key={uidChild}
              leftCheckbox={childLeftCheckbox}
              primaryText={categoryChild.title}
              style={this.styleListItemChild}
            />
          )
          childrenItems.push(childListItem)
        })
      }

      const checkedParent = appliedFilterIds.includes(uidParent)
      const parentLeftCheckbox = (
        <Checkbox
          disabled={this.disableAll}
          checked={checkedParent}
          onCheck={() => {
            this._toggleCheckbox(uidParent, childrenUids, !checkedParent)
          }}
          style={this.styleListItemCheckbox}
        />
      )

      const parentListItem = (
        <ListItem
          disabled={this.disableAll}
          key={uidParent}
          autoGenerateNestedIndicator={false}
          initiallyOpen
          leftCheckbox={parentLeftCheckbox}
          nestedItems={childrenItems}
          open={checkedParent}
          primaryText={category.title}
          style={this.styleListItemParent}
        />
      )

      return parentListItem
    })

    return _categories
  }

  _sortByTitle(a, b) {
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  }

  _sortCategories(categories) {
    const _categories = [...categories]
    // Sort root level
    _categories.sort(this._sortByTitle)
    const _categoriesSorted = _categories.map((category) => {
      // Sort children
      const children = selectn('contextParameters.children.entries', category)
      if (children.length > 0) {
        children.sort(this._sortByTitle)
      }
      return category
    })
    return _categoriesSorted
  }

  _clearCategoryFilter() {
    this.props.clearCategoryFilter()
  }

  _toggleCheckbox = debounce(async(checkedFacetUid, childrenIds = [], isChecked, facetUidParent) => {
    this.setState(
      {
        disableAll: true,
      },
      async() => {
        await this.props.onFacetSelected(this.props.facetField, checkedFacetUid, childrenIds, isChecked, facetUidParent)
        this.setState({
          disableAll: false,
        })
      }
    )
  }, 200)
}
