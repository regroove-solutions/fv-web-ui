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
    groupName: 'Form__group',
    name: 'FormDefinitions',
  }

  static propTypes = {
    name: string.isRequired,
    className: string,
    groupName: string,
  }

  state = {
    items: [],
    itemData: {},
  }

  render() {
    const { className } = this.props

    const { items } = this.state

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

        {this._generateHiddenInput()}

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

        <Select
          ariaDescribedby="describedbyLanguage"
          className="DefinitionLanguage"
          id={`definitions.${items.length}.language`}
          labelText="Language"
          name="" // Note: intentionally generating invalid name so won't be picked up by `new FormData(this.form)`
          handleChange={(value) => {
            this._handleChange({
              id,
              value,
              property: 'language',
            })
          }}
          value="english"
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
          id={`definitions.${items.length}.translation`}
          labelText="Translation"
          name="" // Note: intentionally generating invalid name so won't be picked up by `new FormData(this.form)`
          handleChange={(value) => {
            this._handleChange({
              id,
              value,
              property: 'translation',
            })
          }}
        />
      </fieldset>
    )
    const { itemData } = this.state
    itemData[id] = { language: 'english', translation: '' }
    this.setState({
      items,
      itemData,
    })
  }

  _generateHiddenInput = () => {
    const { items, itemData } = this.state
    const arrayOfObjects = items.map((element) => {
      const id = element.props.id
      return itemData[id]
    })
    return <input type="hidden" name="fv:definitions" value={JSON.stringify(arrayOfObjects)} />
  }

  _handleChange = (arg) => {
    const { id, value, property } = arg
    const { itemData: _itemData } = this.state
    _itemData[id][property] = value
    this.setState({
      itemData: _itemData,
    })
  }

  handleClickRemoveItem = (id) => {
    this.setState({
      items: removeItem({ id, items: this.state.items }),
    })
  }

  handleClickMoveItemDown = (id) => {
    const items = moveItemDown({ id, items: this.state.items })
    this.setState({
      items,
    })
  }

  handleClickMoveItemUp = (id) => {
    this.setState({
      items: moveItemUp({ id, items: this.state.items }),
    })
  }
}
