import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import Select from './Select'
const { string } = PropTypes

export default class FormLiteralTranslations extends React.Component {
  static defaultProps = {
    className: 'FormLiteralTranslations',
    name: 'FormLiteralTranslations',
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
        <legend>Literal Translations</legend>
        <p className="alert alert-info">Describe what the word translates to regardless of context</p>

        <button
          type="button"
          onClick={() => {
            this.handleClickAddItem()
          }}
        >
          Add a Literal Translation
        </button>

        {items}

        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id="describedbyLanguageLiteralTranslation" className="visually-hidden">
          You are adding a Literal Translation for the new word. Please specify the Language of the Literal Translation.
        </span>
        <span id="describedByTranslationLiteralTranslation" className="visually-hidden">
          You are adding a Literal Translation for the new word. Please type a Translation of the Literal Translation in
          the selected Language.
        </span>
        <span id="describedByLiteralTranslationMove" className="visually-hidden">
          {`If you are adding multiple Literal Translations, you can change the position of the Literal Translation with
the 'Move Literal Translation up' and 'Move Literal Translation down' buttons`}
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
        <legend>Literal Translation</legend>
        <Select
          ariaDescribedby="describedbyLanguageLiteralTranslation"
          className="LiteralTranslationLanguage"
          id="CreateWord__LiteralTranslationLanguage0"
          labelText="Language"
          name="fv:literal_translation[0][language]"
        >
          {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
          <optgroup>
            <option value="english">English</option>
            <option value="french">French</option>
            <option value="mandarin">Mandarin</option>
          </optgroup>
        </Select>
        <Text
          className="Create__LiteralTranslationTranslation"
          ariaDescribedby="describedByTranslationLiteralTranslation"
          id="CreateWord__LiteralTranslationTranslation0"
          labelText="Translation"
          name="fv:literal_translation[0][translation]"
        />

        <button
          type="button"
          onClick={() => {
            this.handleClickRemoveItem(id)
          }}
        >
          Remove Literal Translation
        </button>
        <button
          aria-describedby="describedByLiteralTranslationMove"
          type="button"
          onClick={() => {
            this.handleClickMoveItemUp(id)
          }}
        >
          Move Literal Translation up
        </button>
        <button
          aria-describedby="describedByLiteralTranslationMove"
          type="button"
          onClick={() => {
            this.handleClickMoveItemDown(id)
          }}
        >
          Move Literal Translation down
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
