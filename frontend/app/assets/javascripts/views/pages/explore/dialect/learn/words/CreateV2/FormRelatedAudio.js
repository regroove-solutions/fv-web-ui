import React from 'react'
import { PropTypes } from 'react'
// import Text from './Text'

// NOTE: importing the non-wrapped provide() version
import FormRelatedAudioItem from './FormRelatedAudioItem'
import { getIndexOfElementById, removeItem, moveItemDown, moveItemUp } from './FormInteractions'
import ProviderHelpers from 'common/ProviderHelpers'
import provide from 'react-redux-provide'
import selectn from 'selectn'

const { string, array, object, func, number } = PropTypes
let SelectMediaComponent = null

export class FormRelatedAudio extends React.Component {
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
    className: 'FormRelatedAudio',
    idDescribedbyItemBrowse: 'describedbyRelatedAudioBrowse',
    idDescribedByItemMove: 'describedByRelatedAudioMove',
    name: 'FormRelatedAudio',
    textDescribedbyItemBrowse: 'Select an audio sample from previously uploaded items',
    textDescribedByItemMove: `If you are adding multiple Related Audio Items, you can change the position of the item with
    the 'Move Related Audio Item left' and 'Move Related Audio Item right' buttons`,
    textLegendItems: 'Related Audio',
    textBtnAddItem: 'Add Related Audio Item',
    textLegendItem: 'Related Audio Item',
    textBtnEditItem: 'Edit Related Audio Item',
    textBtnRemoveItem: 'Remove Related Audio Item',
    textBtnMoveItemUp: 'Move Related Audio Item left',
    textBtnMoveItemDown: 'Move Related Audio Item right',
    textBtnCreateItem: 'Create new audio item',
    textBtnSelectExistingItems: 'Select from existing audio',
    textLabelItemSearch: 'Search existing audio',
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
  }

  state = {
    items: [],
    loading: true,
    audioItems: [],
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

    // Get existing audio files
    // TODO: hardcoded current page and page size!
    await fetchResources(
      '/FV/Workspaces/',
      `AND ecm:primaryType LIKE 'FVAudio' AND ecm:isCheckedInVersion = 0 AND ecm:isTrashed = 0 AND ecm:currentLifeCycleState != 'Disabled' AND (ecm:path STARTSWITH '${
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
  /*
// RELATED AUDIO > CREATED ---------------
<fieldset>
  <legend>Related Audio Item</legend>
  <input type="hidden" name="fv:related_audio[0]" value="49d81e97-8220-4e8f-bed2-b58bfc040868" />
  <div>[AUDIO COMPONENT HERE]</div>
  <button type="button">Remove Related Audio Item</button>
  <button type="button" aria-describedby="describedByRelatedAudioMove">
    Move Related Audio Item left
  </button>
  <button type="button" aria-describedby="describedByRelatedAudioMove">
    Move Related Audio Item right
  </button>
</fieldset>


*/

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
      <FormRelatedAudioItem
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
    // let { audioItems } = this.state
    // const existingIndex = audioItems.findIndex((element) => {
    //   return element.uid === uid
    // })
    // if (existingIndex !== -1) {
    //   audioItems = audioItems.filter((element) => {
    //     return element.uid !== uid
    //   })
    // }
    // // add selected to end
    // this.setState({
    //   audioItems: [...audioItems, { uid, path, title }],
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
          <FormRelatedAudioItem
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

export default provide(FormRelatedAudio)
