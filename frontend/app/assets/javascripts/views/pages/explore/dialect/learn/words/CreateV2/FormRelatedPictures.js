import React from 'react'
import { PropTypes } from 'react'
// import Text from './Text'

// NOTE: importing the non-wrapped provide() version
import FormRelatedPicture from './FormRelatedPicture'
import { getIndexOfElementById, removeItem, moveItemDown, moveItemUp } from './FormInteractions'
import ProviderHelpers from 'common/ProviderHelpers'
import provide from 'react-redux-provide'
import selectn from 'selectn'

const { string, array, object, func, number } = PropTypes
let SelectMediaComponent = null

export class FormRelatedPictures extends React.Component {
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
    textBtnEditItem: string,
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
    className: 'FormRelatedPictures',
    idDescribedbyItemBrowse: 'describedbyRelatedPictureBrowse',
    idDescribedByItemMove: 'describedByRelatedPictureMove',
    name: 'FormRelatedPictures',
    textDescribedbyItemBrowse: 'Select a picture from previously created pictures',
    textDescribedByItemMove: `If you are adding multiple Related Pictures, you can change the position of the picture with
    the 'Move Related Picture left' and 'Move Related Picture right' buttons`,
    textLegendItems: 'Related Pictures',
    textBtnAddItem: 'Add Related Picture',
    textLegendItem: 'Related Picture',
    textBtnEditItem: 'Edit Related Picture',
    textBtnRemoveItem: 'Remove Related Picture',
    textBtnMoveItemUp: 'Move Related Picture left',
    textBtnMoveItemDown: 'Move Related Picture right',
    textBtnCreateItem: 'Create new picture',
    textBtnSelectExistingItems: 'Select from existing pictures',
    textLabelItemSearch: 'Search existing pictures',
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
  }

  state = {
    items: [],
    loading: true,
    pictures: [],
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

    // Get existing pictures
    // TODO: hardcoded current page and page size!
    await fetchResources(
      '/FV/Workspaces/',
      `AND ecm:primaryType LIKE 'FVPicture' AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0 AND ecm:currentLifeCycleState != 'Disabled' AND (ecm:path STARTSWITH '${
        this.DIALECT_PATH
      }/Resources/')&currentPageIndex=${0}&pageSize=${1000}`
    )

    const _SelectMediaComponent = await import('views/components/Editor/SelectMediaComponent')
    SelectMediaComponent = _SelectMediaComponent.default

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

  handleClickAddItem = () => {
    const _props = {
      name: this.props.name,
      className: this.props.className,
      idDescribedbyItemBrowse: this.props.idDescribedbyItemBrowse,
      idDescribedByItemMove: this.props.idDescribedByItemMove,
      textLegendItem: this.props.textLegendItem,
      textBtnEditItem: this.props.textBtnEditItem,
      textBtnRemoveItem: this.props.textBtnRemoveItem,
      textBtnMoveItemUp: this.props.textBtnMoveItemUp,
      textBtnMoveItemDown: this.props.textBtnMoveItemDown,
      textBtnCreateItem: this.props.textBtnCreateItem,
      textBtnSelectExistingItems: this.props.textBtnSelectExistingItems,
      textLabelItemSearch: this.props.textLabelItemSearch,
      handleClickCreateItem: this.handleClickCreateItem,
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
    items.push(
      <FormRelatedPicture
        // componentState={2}
        // SET STATE:
        // audioItemUid=""
        // EDIT STATE:
        // audioItemUid=""
        // audioItemName=""
        // audioItemDescription=""
        key={id}
        id={id}
        {..._props}
        selectMediaComponent={SelectMediaComponent}
      />
    )
    this.setState({
      items,
    })
  }
  handleClickCreateItem = () => {
    // console.log('! handleClickCreateItem', this.index)
  }
  handleItemSelected = (selected, callback) => {
    const uid = selectn('uid', selected)
    // const path = selectn(['properties', 'file:content', 'data'], selected)
    // const title = selectn(['title'], selected)

    // filter out any pre-added elements
    // let { pictures } = this.state
    // const existingIndex = pictures.findIndex((element) => {
    //   return element.uid === uid
    // })
    // if (existingIndex !== -1) {
    //   pictures = pictures.filter((element) => {
    //     return element.uid !== uid
    //   })
    // }
    // // add selected to end
    // this.setState({
    //   pictures: [...pictures, { uid, path, title }],
    // })
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
      textBtnEditItem: this.props.textBtnEditItem,
      textBtnRemoveItem: this.props.textBtnRemoveItem,
      textBtnMoveItemUp: this.props.textBtnMoveItemUp,
      textBtnMoveItemDown: this.props.textBtnMoveItemDown,
      textBtnCreateItem: this.props.textBtnCreateItem,
      textBtnSelectExistingItems: this.props.textBtnSelectExistingItems,
      textLabelItemSearch: this.props.textLabelItemSearch,
      handleClickCreateItem: this.handleClickCreateItem,
      handleClickSelectItem: this.handleClickSelectItem,
      handleClickRemoveItem: this.handleClickRemoveItem,
      handleClickMoveItemUp: this.handleClickMoveItemUp,
      handleClickMoveItemDown: this.handleClickMoveItemDown,
      handleItemSelected: this.handleItemSelected,
      computeDialectFromParent: this.props.computeDialect,
      DIALECT_PATH: this.DIALECT_PATH,
    }

    this.setState(
      {
        items: [
          ...items,
          <FormRelatedPicture
            componentState={3}
            key={uid}
            id={uid}
            {..._props}
            selectMediaComponent={SelectMediaComponent}
          />,
        ],
      },
      () => {
        if (callback) {
          callback()
        }
      }
    )
  }
  handleClickEditItem = () => {
    // console.log('! handleClickEditItem')
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

export default provide(FormRelatedPictures)
