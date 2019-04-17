import React from 'react'
import { PropTypes } from 'react'
// import Text from './Text'
import FormRelatedAudioItem from './FormRelatedAudioItem'
import { removeItem, moveItemDown, moveItemUp } from './FormInteractions'
const { string, array } = PropTypes

export default class FormRelatedAudio extends React.Component {
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
    textBtnCreateItem: 'Upload new audio',
    textBtnSelectExistingItems: 'Select from existing audio',
    textLabelItemSearch: 'Search existing audio',
  }

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
  }

  state = {
    items: [],
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
    const {
      className,
      name,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      textLegendItem,
      textBtnEditItem,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textBtnCreateItem,
      textBtnSelectExistingItems,
      textLabelItemSearch,
    } = this.props
    const _props = {
      name,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      textLegendItem,
      textBtnEditItem,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textBtnCreateItem,
      textBtnSelectExistingItems,
      textLabelItemSearch,
      handleClickCreateItem: this.handleClickCreateItem,
      handleClickSelectItem: this.handleClickSelectItem,
      handleClickRemoveItem: this.handleClickRemoveItem,
      handleClickMoveItemUp: this.handleClickMoveItemUp,
      handleClickMoveItemDown: this.handleClickMoveItemDown,
    }

    const items = this.state.items
    const id = `${className}_${items.length}_${Date.now()}`
    items.push(<FormRelatedAudioItem key={id} id={id} {..._props} />)
    this.setState({
      items,
    })
  }
  handleClickCreateItem = () => {
    // console.log('! handleClickCreateItem', this.index)
  }
  handleClickSelectItem = () => {
    // console.log('! handleClickSelectItem')
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
