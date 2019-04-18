import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import { removeItem, moveItemDown, moveItemUp } from './FormInteractions'
const { string } = PropTypes

export default class FormCulturalNotes extends React.Component {
  static defaultProps = {
    className: 'FormCulturalNotes',
    groupName: 'FormCulturalNote__group',
    name: 'FormCulturalNotes',
  }

  static propTypes = {
    name: string.isRequired,
    className: string,
    groupName: string,
  }

  state = {
    items: [],
  }

  render() {
    const { className, groupName } = this.props

    const items = this.state.items
    return (
      <fieldset className={`${className} ${groupName}`}>
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
      <fieldset key={id} id={id} className={this.props.groupName}>
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
