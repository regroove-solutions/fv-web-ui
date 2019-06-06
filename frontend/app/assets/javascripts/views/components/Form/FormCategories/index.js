import React from 'react'
import { PropTypes } from 'react'
// import Text from './Text'

import copy from './internationalization'
// NOTE: importing the non-wrapped provide() version
import FormCategory from 'views/components/Form/FormCategory'
import Description from 'views/components/Form/Common/Description'
import { getIndexOfElementById, removeItem, moveItemDown, moveItemUp } from 'views/components/Form/FormInteractions'
import ProviderHelpers from 'common/ProviderHelpers'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCategories } from 'providers/redux/reducers/fvCategory'
import { fetchDialect } from 'providers/redux/reducers/fvDialect'
import { fetchResources } from 'providers/redux/reducers/fvResources'

import selectn from 'selectn'
import BrowseComponent from 'views/components/Editor/BrowseComponent'
const { string, array, object, func, number } = PropTypes

export class FormCategories extends React.Component {
  static propTypes = {
    className: string,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    items: array,
    idDescribedbyItemBrowse: string,
    idDescribedByItemMove: string,
    name: string.isRequired,
    textBrowseComponentLabel: string,
    textBtnAddItem: string,
    textDescription: string,
    textDescribedbyItemBrowse: string,
    textDescribedByItemMove: string,
    textInfo: string,
    textLegendItems: string,
    // REDUX: reducers/state
    computeCategories: object.isRequired,
    computeDialect: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    fetchCategories: func.isRequired,
    fetchDialect: func.isRequired,
    fetchResources: func.isRequired,
  }
  static defaultProps = {
    className: 'FormCategories',
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
    idDescribedbyItemBrowse: 'describedbyCategoryBrowse',
    idDescribedByItemMove: 'describedByCategoryMove',
    name: 'FormCategories',
    textDescription: copy.description,
    textBrowseComponentLabel: copy.browseComponentLabel,
    textDescribedbyItemBrowse: copy.describedbyItemBrowse,
    textDescribedByItemMove: copy.describedByItemMove,
    textLegendItems: copy.legendItems,
    textBtnAddItem: copy.btnAddItem,
    textLegendItem: copy.legendItem,
  }

  state = {
    items: [],
    loading: true,
    categories: [],
  }

  // Fetch data on initial render
  async componentDidMount() {
    const { splitWindowPath } = this.props
    const categoriesPath = '/api/v1/path/FV/Workspaces/SharedData/Shared Categories/@children'
    await this.props.fetchCategories(categoriesPath)

    const dialect = await selectn('response', this.props.computeDialect)
    if (dialect) {
      this.setState({
        loading: false,
        dialect,
        dialectPath: ProviderHelpers.getDialectPathFromURLArray(splitWindowPath),
      })
    }
  }

  render() {
    const {
      className,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      textDescribedbyItemBrowse,
      textDescribedByItemMove,
      textLegendItems,
    } = this.props

    const items = this.state.items
    return (
      <fieldset className={className}>
        <legend>{textLegendItems}</legend>
        <Description text={this.props.textDescription} />
        {this.state.dialect && BrowseComponent && (
          <BrowseComponent
            type="FVCategory"
            label={this.props.textBrowseComponentLabel}
            onComplete={this.handleItemSelected}
            disabled={this.state.dialect === undefined}
            dialect={this.state.dialect}
            containerType="FVWord"
          />
        )}

        {items}

        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id={idDescribedbyItemBrowse} className="visually-hidden">
          {textDescribedbyItemBrowse}
        </span>
        <span id={idDescribedByItemMove} className="visually-hidden">
          {textDescribedByItemMove}
        </span>
      </fieldset>
    )
  }

  handleItemSelected = (selected, callback) => {
    const uid = selectn('uid', selected)

    let { items } = this.state
    const { dialectPath } = this.state
    const arg = { id: uid, items }

    if (getIndexOfElementById(arg) !== -1) {
      items = removeItem(arg)
    }
    const p = this.props
    const newItem = (
      <FormCategory
        computeDialectFromParent={p.computeDialect}
        className={p.className}
        DIALECT_PATH={dialectPath}
        componentState={3}
        handleClickSelectItem={this.handleClickSelectItem}
        handleClickRemoveItem={this.handleClickRemoveItem}
        handleClickMoveItemUp={this.handleClickMoveItemUp}
        handleClickMoveItemDown={this.handleClickMoveItemDown}
        handleItemSelected={this.handleItemSelected}
        id={uid}
        idDescribedbyItemBrowse={p.idDescribedbyItemBrowse}
        idDescribedByItemMove={p.idDescribedByItemMove}
        key={uid}
        name={p.name}
      />
    )
    this.setState(
      {
        items: [...items, newItem],
      },
      () => {
        if (callback) {
          callback()
        }
      }
    )
  }
  handleClickRemoveItem = (id) => {
    this.setState({
      items: removeItem({ id, items: this.state.items }),
    })
  }
  handleClickMoveItemDown = (id) => {
    this.setState({
      items: moveItemDown({ id, items: this.state.items }),
    })
  }
  handleClickMoveItemUp = (id) => {
    this.setState({
      items: moveItemUp({ id, items: this.state.items }),
    })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, fvDialect, windowPath } = state

  const { computeCategories } = fvCategory
  const { computeDialect } = fvDialect
  const { splitWindowPath } = windowPath

  return {
    computeCategories,
    computeDialect,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
  fetchDialect,
  fetchResources,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormCategories)
