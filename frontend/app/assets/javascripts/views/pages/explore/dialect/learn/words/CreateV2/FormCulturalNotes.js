import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
const { string } = PropTypes

export default class FormCulturalNotes extends React.Component {
  static defaultProps = {
    className: 'FormCulturalNotes',
    name: 'FormCulturalNotes',
  }

  static propTypes = {
    name: string.isRequired,
    className: string,
  }

  state = {
    items: [],
  }

  render() {
    const { className } = this.props

    const items = this.state.items
    return (
      <fieldset className={className}>
        <legend>Cultural Notes</legend>

        <button
          type="button"
          onClick={() => {
            this.handleClickAddItem()
          }}
        >
          Add Cultural Note
        </button>

        {items}

        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id="describedByCulturalNoteMove" className="visually-hidden">
          {`If you are adding multiple Cultural Notes, you can change the position of the Cultural Note with
the 'Move Cultural Note up' and 'Move Cultural Note down' buttons`}
        </span>
      </fieldset>
    )
  }

  handleClickAddItem = () => {
    const items = this.state.items
    const { className } = this.props
    const id = `${className}_${items.length}_${Date.now()}`

    items.push(
      <fieldset key={id} id={id}>
        <legend className="visually-hidden">Cultural Note</legend>
        <Text
          className="Create__CulturalNote"
          id="CreateWord__CulturalNote0"
          labelText="Cultural Note"
          name="fv:cultural_note[0]"
          value=""
        />
        <button
          onClick={() => {
            this.handleClickRemoveItem(id)
          }}
          type="button"
        >
          Remove Cultural Note
        </button>

        <button
          aria-describedby="describedByCulturalNoteMove"
          onClick={() => {
            this.handleClickMoveItemUp(id)
          }}
          type="button"
        >
          Move Cultural Note up
        </button>
        <button
          type="button"
          aria-describedby="describedByCulturalNoteMove"
          onClick={() => {
            this.handleClickMoveItemDown(id)
          }}
        >
          Move Cultural Note down
        </button>
      </fieldset>
    )
    this.setState({
      items,
    })
  }
  getIndexOfElementById = (id, items) => {
    return items.findIndex((element) => {
      return element.props.id === id
    })
  }
  handleClickRemoveItem = (id) => {
    const _items = this.state.items
    const sourceIndex = this.getIndexOfElementById(id, _items)
    if (sourceIndex !== -1) {
      // remove
      const items = _items.filter((element) => {
        return element.props.id !== id
      })
      // set
      this.setState({
        items,
      })
    }
  }
  handleClickMoveItemDown = (id) => {
    this.handleClickMoveItem(1, id, this.state.items)
  }
  handleClickMoveItemUp = (id) => {
    this.handleClickMoveItem(-1, id, this.state.items)
  }
  handleClickMoveItem = (direction, id, _items) => {
    const items = [..._items]

    const sourceIndex = this.getIndexOfElementById(id, items)
    const sourceItem = items[sourceIndex]
    let destinationIndex = sourceIndex + direction

    // correct for overshoots
    if (destinationIndex >= items.length) {
      destinationIndex = items.length - 1
    }
    if (destinationIndex < 0) {
      destinationIndex = 0
    }

    // swap
    items[sourceIndex] = items[destinationIndex]
    items[destinationIndex] = sourceItem

    // set
    this.setState({
      items,
    })
  }
}
