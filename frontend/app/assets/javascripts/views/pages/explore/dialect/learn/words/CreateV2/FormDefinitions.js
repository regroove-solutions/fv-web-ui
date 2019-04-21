import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import Select from './Select'
import FormMoveButtons from './FormMoveButtons'
import FormRemoveButton from './FormRemoveButton'
import { removeItem, moveItemDown, moveItemUp } from './FormInteractions'
const { string } = PropTypes

export default class FormDefinitions extends React.Component {
  static defaultProps = {
    className: 'FormDefinitions',
    groupName: 'FormDefinitions__group',
    name: 'FormDefinitions',
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
    const { className } = this.props

    const items = this.state.items
    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>Definitions</legend>
        <p className="alert alert-info">Describe what the word actually means</p>

        <button
          type="button"
          onClick={() => {
            this.handleClickAddItem()
          }}
        >
          Add a Definition
        </button>

        {items}

        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id="describedbyLanguage" className="visually-hidden">
          You are adding a Definition for the new word. Please specify the Language of the Definition.
        </span>
        <span id="describedByTranslation" className="visually-hidden">
          You are adding a Definition for the new word. Please type a Translation of the Definition in the selected
          Language.
        </span>
        <span id="describedByDefinitionMove" className="visually-hidden">
          {`If you are adding multiple Definitions, you can change the position of the Definition with the 'Move
Definition up' and 'Move Definition down' buttons`}
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
        <legend>Definition</legend>
        <Select
          ariaDescribedby="describedbyLanguage"
          className="DefinitionLanguage"
          id="CreateWord__DefinitionLanguage0"
          labelText="Language"
          name="fv:definitions[0][language]"
        >
          {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
          <optgroup>
            <option value="english">English</option>
            <option value="french">French</option>
            <option value="mandarin">Mandarin</option>
          </optgroup>
        </Select>
        <Text
          className="Create__DefinitionTranslation"
          ariaDescribedby="describedByTranslation"
          id="CreateWord__DefinitionTranslation0"
          labelText="Translation"
          name="fv:definitions[0][translation]"
        />

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
