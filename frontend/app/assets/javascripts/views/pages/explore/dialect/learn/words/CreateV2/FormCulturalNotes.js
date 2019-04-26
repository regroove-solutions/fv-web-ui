import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import FormMoveButtons from './FormMoveButtons'
import FormRemoveButton from './FormRemoveButton'
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

        <div className="FormItemButtons">
          <FormMoveButtons
            id={id}
            idDescribedByItemMove={'describedByDefinitionMove'}
            textBtnMoveItemUp={'Move Definition up'}
            textBtnMoveItemDown={'Move Definition down'}
            handleClickMoveItemUp={this.handleClickMoveItemUp}
            handleClickMoveItemDown={this.handleClickMoveItemDown}
          />
          <FormRemoveButton
            id={id}
            textBtnRemoveItem={'Remove Definition'}
            handleClickRemoveItem={this.handleClickRemoveItem}
          />
        </div>

        <Text
          className="Create__CulturalNote"
          id="CreateWord__CulturalNote0"
          labelText="Cultural Note"
          name="fv:cultural_note"
          value=""
        />
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
