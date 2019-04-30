import React from 'react'
import { PropTypes } from 'react'
// import Text from './Text'

// NOTE: importing the non-wrapped provide() version
// import FormRelatedPhraseItem from './FormRelatedPhraseItem'
import { getIndexOfElementById, removeItem, moveItemDown, moveItemUp } from './FormInteractions'
import ProviderHelpers from 'common/ProviderHelpers'
import provide from 'react-redux-provide'
import selectn from 'selectn'

const { string, array, object, func, number } = PropTypes
let BrowseComponent = null

export class FormRelatedPhrase extends React.Component {
  static propTypes = {
    name: string.isRequired,
    className: string,
    textInfo: string,
    items: array,
    idDescribedbyItemBrowse: string,
    idDescribedByItemMove: string,
    textDescribedbyItemBrowse: string,
    textDescribedByItemMove: string,
    textLegendItems: string,
    textBtnAddItem: string,
    textLegendItem: string,
    textBtnRemoveItem: string,
    textBtnMoveItemUp: string,
    textBtnMoveItemDown: string,
    textBtnCreateItem: string,
    textBtnSelectExistingItems: string,
    textLabelItemSearch: string,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    // REDUX/PROVIDE
    computeContributor: object.isRequired,
    computeContributors: object.isRequired,
    computeCreateContributor: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    createContributor: func.isRequired,
    fetchContributors: func.isRequired,
    fetchDialect: func.isRequired,
    fetchResources: func.isRequired,
    splitWindowPath: array.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedPhrase',
    idDescribedbyItemBrowse: 'describedbyRelatedAudioBrowse',
    idDescribedByItemMove: 'describedByRelatedAudioMove',
    name: 'FormRelatedPhrase',
    textDescribedbyItemBrowse: 'Select a Related Phrase from previously created Phrases',
    textDescribedByItemMove: `If you are adding multiple Related Phrases, you can change the position of the Phrase with
    the 'Move Related Phrase up' and 'Move Related Phrase down' buttons`,
    textLegendItems: 'Related Phrase',
    textBtnAddItem: 'Add Related Phrase',
    textLegendItem: 'Related Phrase',
    textBtnRemoveItem: 'Remove Related Phrase',
    textBtnMoveItemUp: 'Move Related Phrase left',
    textBtnMoveItemDown: 'Move Related Phrase right',
    textBtnCreateItem: 'Create new Phrase',
    textBtnSelectExistingItems: 'Select from existing Phrases',
    textLabelItemSearch: 'Search existing Phrases',
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
  }

  state = {
    items: [],
    loading: true,
  }

  // Fetch data on initial render
  async componentDidMount() {
    const { computeDialect, fetchContributors, fetchDialect, fetchResources, splitWindowPath } = this.props

    // USING this.DIALECT_PATH instead of setting state
    // this.setState({ dialectPath: dialectPath })
    this.DIALECT_PATH = ProviderHelpers.getDialectPathFromURLArray(splitWindowPath)
    this.CONTRIBUTOR_PATH = `${this.DIALECT_PATH}/Contributors`
    // Get data for computeDialect
    if (!computeDialect.success) {
      await fetchDialect('/' + this.DIALECT_PATH)
    }

    const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_TYPE, DEFAULT_SORT_COL } = this.props
    let currentAppliedFilter = '' // eslint-disable-line
    // if (filter.has('currentAppliedFilter')) {
    //   currentAppliedFilter = Object.values(filter.get('currentAppliedFilter').toJS()).join('')
    // }
    // Get contrinbutors
    await fetchContributors(
      this.CONTRIBUTOR_PATH,
      `${currentAppliedFilter}&currentPageIndex=${DEFAULT_PAGE -
        1}&pageSize=${DEFAULT_PAGE_SIZE}&sortOrder=${DEFAULT_SORT_TYPE}&sortBy=${DEFAULT_SORT_COL}`
    )

    // Get existing phrases
    // TODO: hardcoded current page and page size!
    await fetchResources(
      '/FV/Workspaces/',
      `AND ecm:primaryType LIKE 'FVPhrase' AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0 AND ecm:currentLifeCycleState != 'Disabled' AND (ecm:path STARTSWITH '${
        this.DIALECT_PATH
      }/Resources/')&currentPageIndex=${0}&pageSize=${1000}`
    )

    const _BrowseComponent = await import('views/components/Editor/BrowseComponent')
    BrowseComponent = _BrowseComponent.default

    this.setState({ loading: false })
  }

  render() {
    const {
      className,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      textDescribedbyItemBrowse,
      textDescribedByItemMove,
      textLegendItems,
      textBtnAddItem,
    } = this.props

    const items = this.state.items
    return (
      <fieldset className={className}>
        <legend>{textLegendItems}</legend>

        <button
          type="button"
          disabled={this.state.loading}
          onClick={() => {
            this.handleClickAddItem()
          }}
        >
          {textBtnAddItem}
        </button>

        {BrowseComponent && (
          <BrowseComponent
            type={'FVPhrase'}
            label={'textBtnSelectExistingItems'}
            onComplete={(selected, callback) => {
              this.handleItemSelected(selected)
              if (typeof callback === 'function') {
                callback()
              }
            }}
            dialect={selectn('response', this.props.computeDialect)}
          />
        )}

        {items}

        {this._generateHiddenInput()}

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
  _generateHiddenInput = () => {
    const { items } = this.state
    const selectedItems = items.map((element) => {
      return element.props.id
    })
    return <input type="hidden" name="fv-word:related_phrases" value={JSON.stringify(selectedItems)} />
  }

  handleClickAddItem = () => {
    const _props = {
      name: this.props.name,
      className: this.props.className,
      idDescribedbyItemBrowse: this.props.idDescribedbyItemBrowse,
      idDescribedByItemMove: this.props.idDescribedByItemMove,
      textLegendItem: this.props.textLegendItem,
      textBtnRemoveItem: this.props.textBtnRemoveItem,
      textBtnMoveItemUp: this.props.textBtnMoveItemUp,
      textBtnMoveItemDown: this.props.textBtnMoveItemDown,
      textBtnCreateItem: this.props.textBtnCreateItem,
      textBtnSelectExistingItems: this.props.textBtnSelectExistingItems,
      textLabelItemSearch: this.props.textLabelItemSearch,
      handleClickSelectItem: this.handleClickSelectItem,
      handleClickRemoveItem: this.handleClickRemoveItem,
      handleClickMoveItemUp: this.handleClickMoveItemUp,
      handleClickMoveItemDown: this.handleClickMoveItemDown,
      handleItemSelected: this.handleItemSelected,
      computeDialectFromParent: this.props.computeDialect,
      DIALECT_PATH: this.DIALECT_PATH,
    }
    const items = this.state.items
    const id = `${_props.className}_${items.length}_${Date.now()}`
    // items.push(<FormRelatedPhraseItem key={id} id={id} {..._props} browseComponent={BrowseComponent} />)
    items.push(
      <div key={id} id={id} {..._props}>
        An item
      </div>
    )
    this.setState({
      items,
    })
  }
  handleItemSelected = (selected) => {
    const uid = selectn('uid', selected)

    let { items } = this.state
    const arg = { id: uid, items }

    if (getIndexOfElementById(arg) !== -1) {
      items = removeItem(arg)
    }

    const _props = {
      name: this.props.name,
      className: this.props.className,
      idDescribedbyItemBrowse: this.props.idDescribedbyItemBrowse,
      idDescribedByItemMove: this.props.idDescribedByItemMove,
      textLegendItem: this.props.textLegendItem,
      textBtnRemoveItem: this.props.textBtnRemoveItem,
      textBtnMoveItemUp: this.props.textBtnMoveItemUp,
      textBtnMoveItemDown: this.props.textBtnMoveItemDown,
      textBtnCreateItem: this.props.textBtnCreateItem,
      textBtnSelectExistingItems: this.props.textBtnSelectExistingItems,
      textLabelItemSearch: this.props.textLabelItemSearch,
      handleClickSelectItem: this.handleClickSelectItem,
      handleClickRemoveItem: this.handleClickRemoveItem,
      handleClickMoveItemUp: this.handleClickMoveItemUp,
      handleClickMoveItemDown: this.handleClickMoveItemDown,
      handleItemSelected: this.handleItemSelected,
      computeDialectFromParent: this.props.computeDialect,
      DIALECT_PATH: this.DIALECT_PATH,
    }

    this.setState({
      items: [
        ...items,
        //   <FormRelatedPhraseItem
        //     componentState={3}
        //     key={uid}
        //     id={uid}
        //     {..._props}
        //     browseComponent={BrowseComponent}
        //   />,
        <div key={uid} id={uid} {..._props}>
          An item
        </div>,
      ],
    })
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

export default provide(FormRelatedPhrase)
