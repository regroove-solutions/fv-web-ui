import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import Select from './Select'
const { string } = PropTypes

export default class FormDefinitions extends React.Component {
  static defaultProps = {
    className: 'FormDefinitions',
    name: 'FormDefinitions',
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
      <fieldset key={id} id={id}>
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
        <button
          type="button"
          onClick={() => {
            this.handleClickRemoveItem(id)
          }}
        >
          Remove Definition
        </button>
        <button
          aria-describedby="describedByDefinitionMove"
          onClick={() => {
            this.handleClickMoveItemUp(id)
          }}
          type="button"
        >
          Move Definition up
        </button>
        <button
          aria-describedby="describedByDefinitionMove"
          onClick={() => {
            this.handleClickMoveItemDown(id)
          }}
          type="button"
        >
          Move Definition down
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
