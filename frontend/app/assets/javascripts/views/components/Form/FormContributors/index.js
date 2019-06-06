import React from 'react'
import { PropTypes } from 'react'

import copy from './internationalization'
import FormContributor from 'views/components/Form/FormContributor'
import Description from 'views/components/Form/Common/Description'
import { removeItem, moveItemDown, moveItemUp } from 'views/components/Form/FormInteractions'
const { string, array, func } = PropTypes

export default class FormContributors extends React.Component {
  static propTypes = {
    name: string.isRequired,
    className: string,
    items: array,
    idDescribedbyItemBrowse: string,
    idDescribedByItemMove: string,
    textDescription: string,
    textDescribedbyItemBrowse: string,
    textDescribedByItemMove: string,
    textLegendItems: string,
    textBtnAddItem: string,
    handleItemsUpdate: func,
  }
  static defaultProps = {
    className: 'FormContributors',
    idDescribedbyItemBrowse: 'describedbyItemBrowse',
    idDescribedByItemMove: 'describedByItemMove',
    name: 'FormContributors',
    textDescription: copy.description,
    textDescribedbyItemBrowse: copy.describedbyItemBrowse,
    textDescribedByItemMove: copy.describedByItemMove,
    textLegendItems: copy.legendItems,
    textBtnAddItem: copy.btnAddItem,
    handleItemsUpdate: () => {},
  }

  state = {
    items: [],
    itemsIdUid: {},
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

        <Description text={this.props.textDescription} />

        <button
          type="button"
          onClick={() => {
            this.handleClickAddItem()
          }}
        >
          {textBtnAddItem}
        </button>

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

  handleClickAddItem = () => {
    const p = this.props

    const items = this.state.items
    const id = `${p.className}_${items.length}_${Date.now()}`
    items.push(
      <FormContributor
        key={id}
        id={id}
        className={p.className}
        name={p.name}
        idDescribedbyItemBrowse={p.idDescribedbyItemBrowse}
        idDescribedByItemMove={p.idDescribedByItemMove}
        // textLegendItem={p.textLegendItem}
        // textBtnRemoveItem={p.textBtnRemoveItem}
        // textBtnMoveItemUp={p.textBtnMoveItemUp}
        // textBtnMoveItemDown={p.textBtnMoveItemDown}
        // textBtnCreateItem={p.textBtnCreateItem}
        // textBtnSelectExistingItems={p.textBtnSelectExistingItems}
        // textLabelItemSearch={p.textLabelItemSearch}
        handleClickRemoveItem={this.handleClickRemoveItem}
        handleClickMoveItemUp={this.handleClickMoveItemUp}
        handleClickMoveItemDown={this.handleClickMoveItemDown}
        handleItemChange={({ id: _id, uid }) => {
          const { itemsIdUid } = this.state
          itemsIdUid[_id] = uid
          this.setState(itemsIdUid, () => {
            this.props.handleItemsUpdate(this._getFvmSource())
          })
        }}
      />
    )
    this.setState(
      {
        items,
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmSource())
      }
    )
  }
  handleClickRemoveItem = (id) => {
    this.setState(
      {
        items: removeItem({ id, items: this.state.items }),
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmSource())
      }
    )
  }
  handleClickMoveItemDown = (id) => {
    this.setState(
      {
        items: moveItemDown({ id, items: this.state.items }),
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmSource())
      }
    )
  }
  handleClickMoveItemUp = (id) => {
    this.setState(
      {
        items: moveItemUp({ id, items: this.state.items }),
      },
      () => {
        this.props.handleItemsUpdate(this._getFvmSource())
      }
    )
  }
  _generateHiddenInput = () => {
    const { items, itemsIdUid } = this.state
    const selectedItems = items.map((element) => {
      return itemsIdUid[element.props.id]
    })
    return <input type="hidden" name="fvm:source" value={JSON.stringify(selectedItems)} />
  }
  _getFvmSource = () => {
    const { items, itemsIdUid } = this.state
    const fvmSource = []
    items.forEach((element) => {
      const uid = itemsIdUid[element.props.id]
      if (uid) {
        fvmSource.push(uid)
      }
    })
    return {
      'fvm:source': fvmSource,
    }
  }
}
