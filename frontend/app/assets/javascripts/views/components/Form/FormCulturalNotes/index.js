import React from 'react'
import { PropTypes } from 'react'

import copy from './internationalization'
import Text from 'views/components/Form/Common/Text'
import FormMoveButtons from 'views/components/Form/FormMoveButtons'
import FormRemoveButton from 'views/components/Form/FormRemoveButton'
import Description from 'views/components/Form/Common/Description'
import { removeItem, moveItemDown, moveItemUp } from 'views/components/Form/FormInteractions'
const { string } = PropTypes

export default class FormCulturalNotes extends React.Component {
  static propTypes = {
    name: string.isRequired,
    className: string,
    groupName: string,
    textLegend: string,
    textDescription: string,
    textBtnAdd: string,
    textDescribedByMove: string,
    textItemLegend: string,
    textItemLabelText: string,
    textItemTextBtnRemoveItem: string,
    textItemTextBtnMoveItemUp: string,
    textItemTextBtnMoveItemDown: string,
  }
  static defaultProps = {
    className: 'FormCulturalNotes',
    groupName: 'Form__group',
    name: 'FormCulturalNotes',
    textLegend: copy.legend,
    textDescription: copy.description,
    textBtnAdd: copy.btnAdd,
    textDescribedByMove: copy.describedByMove,
    textItemLegend: copy.item.legend,
    textItemLabelText: copy.item.labelText,
    textItemTextBtnRemoveItem: copy.item.textBtnRemoveItem,
    textItemTextBtnMoveItemUp: copy.item.textBtnMoveItemUp,
    textItemTextBtnMoveItemDown: copy.item.textBtnMoveItemDown,
  }

  state = {
    items: [],
    itemData: {},
  }

  render() {
    const { className, groupName } = this.props

    const items = this.state.items
    return (
      <fieldset className={`${className} ${groupName}`}>
        <legend>{this.props.textLegend}</legend>
        <Description text={this.props.textDescription} />
        {items}
        {this._generateHiddenInput()}
        <button
          type="button"
          onClick={() => {
            this.handleClickAddItem()
          }}
        >
          {this.props.textBtnAdd}
        </button>
        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id="describedByCulturalNoteMove" className="visually-hidden">
          {this.props.textDescribedByMove}
        </span>
      </fieldset>
    )
  }
  _generateHiddenInput = () => {
    const { items, itemData } = this.state
    const selectedItems = items.map((element) => {
      const id = element.props.id
      return itemData[id]
    })
    return <input type="hidden" name="fv:cultural_note" value={JSON.stringify(selectedItems)} />
  }
  handleClickAddItem = () => {
    const items = this.state.items
    const { className } = this.props
    const id = `${className}_${items.length}_${Date.now()}`

    items.push(
      <fieldset key={id} id={id} className={this.props.groupName}>
        <legend className="visually-hidden">{this.props.textItemLegend}</legend>
        <div className="Form__sidebar">
          <div className="Form__main">
            <Text
              className="Create__CulturalNote"
              id="CreateWord__CulturalNote0"
              labelText={this.props.textItemLabelText}
              name="" // Note: intentionally generating invalid name so won't be picked up by `new FormData(this.form)`
              value=""
              handleChange={(value) => {
                const { itemData } = this.state
                itemData[id] = value
                this.setState({
                  itemData,
                })
              }}
              setRef={(element) => {
                this[`${id}.text`] = element
              }}
            />
          </div>
          <div className="FormItemButtons Form__aside">
            <FormRemoveButton
              id={id}
              textBtnRemoveItem={this.props.textItemTextBtnRemoveItem}
              handleClickRemoveItem={this.handleClickRemoveItem}
            />
            <FormMoveButtons
              id={id}
              idDescribedByItemMove={'describedByDefinitionMove'}
              textBtnMoveItemUp={this.props.textItemTextBtnMoveItemUp}
              textBtnMoveItemDown={this.props.textItemTextBtnMoveItemDown}
              handleClickMoveItemUp={this.handleClickMoveItemUp}
              handleClickMoveItemDown={this.handleClickMoveItemDown}
            />
          </div>
        </div>
      </fieldset>
    )
    const { itemData } = this.state
    itemData[id] = ''
    this.setState(
      {
        items,
        itemData,
      },
      () => {
        this[`${id}.text`].focus()
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
