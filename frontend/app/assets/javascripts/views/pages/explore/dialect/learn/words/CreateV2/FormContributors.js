import React from 'react'
import { PropTypes } from 'react'
import FormContributor from './FormContributor'
import { removeItem, moveItemDown, moveItemUp } from './FormInteractions'
const { string, array } = PropTypes

export default class FormContributors extends React.Component {
  static defaultProps = {
    className: 'FormContributors',
    idDescribedbyContributorBrowse: 'describedbyContributorBrowse',
    idDescribedByContributorMove: 'describedByContributorMove',
    name: 'FormContributors',
    textDescribedbyContributorBrowse: 'Select a Contributor from previously created Contributors',
    textDescribedByContributorMove:
      "If you are adding multiple Contributors, you can change the position of the Contributor with the 'Move Contributor up' and 'Move Contributor down' buttons",
    textLegendContributors: 'Contributors',
    textBtnAddContributor: 'Add Contributor',
    textLegendContributor: 'Contributor',
    textBtnEditContributor: 'Edit Contributor',
    textBtnRemoveContributor: 'Remove Contributor',
    textBtnMoveContributorUp: 'Move Contributor up',
    textBtnMoveContributorDown: 'Move Contributor down',
    textBtnCreateContributor: 'Create new Contributor',
    textBtnSelectExistingContributors: 'Select from existing Contributors',
    textLabelContributorSearch: 'Search existing Contributors',
  }

  static propTypes = {
    name: string.isRequired,
    className: string,
    textInfo: string,
    items: array,
    idDescribedbyContributorBrowse: string,
    idDescribedByContributorMove: string,
    textDescribedbyContributorBrowse: string,
    textDescribedByContributorMove: string,
    textLegendContributors: string,
    textBtnAddContributor: string,
    textLegendContributor: string,
    textBtnEditContributor: string,
    textBtnRemoveContributor: string,
    textBtnMoveContributorUp: string,
    textBtnMoveContributorDown: string,
    textBtnCreateContributor: string,
    textBtnSelectExistingContributors: string,
    textLabelContributorSearch: string,
  }

  state = {
    items: [],
  }

  render() {
    const {
      className,
      textInfo,
      idDescribedbyContributorBrowse,
      idDescribedByContributorMove,
      textDescribedbyContributorBrowse,
      textDescribedByContributorMove,
      textLegendContributors,
      textBtnAddContributor,
    } = this.props

    // const items = this.getItems()
    const items = this.state.items
    return (
      <fieldset className={className}>
        <legend>{textLegendContributors}</legend>
        {textInfo && <p className="alert alert-info">{textInfo}</p>}
        <button
          type="button"
          onClick={() => {
            this.handleClickAddContributor()
          }}
        >
          {textBtnAddContributor}
        </button>

        {items}

        {/* SCREEN READER DESCRIPTIONS --------------- */}
        <span id={idDescribedbyContributorBrowse} className="visually-hidden">
          {textDescribedbyContributorBrowse}
        </span>
        <span id={idDescribedByContributorMove} className="visually-hidden">
          {textDescribedByContributorMove}
        </span>
      </fieldset>
    )
  }

  handleClickAddContributor = () => {
    const {
      className,
      name,
      idDescribedbyContributorBrowse,
      idDescribedByContributorMove,
      textLegendContributor,
      textBtnEditContributor,
      textBtnRemoveContributor,
      textBtnMoveContributorUp,
      textBtnMoveContributorDown,
      textBtnCreateContributor,
      textBtnSelectExistingContributors,
      textLabelContributorSearch,
    } = this.props
    const _props = {
      className,
      name,
      idDescribedbyContributorBrowse,
      idDescribedByContributorMove,
      textLegendContributor,
      textBtnEditContributor,
      textBtnRemoveContributor,
      textBtnMoveContributorUp,
      textBtnMoveContributorDown,
      textBtnCreateContributor,
      textBtnSelectExistingContributors,
      textLabelContributorSearch,
      handleClickCreateContributor: this.handleClickCreateContributor,
      handleClickSelectContributor: this.handleClickSelectContributor,
      handleClickRemoveItem: this.handleClickRemoveItem,
      handleClickMoveItemUp: this.handleClickMoveItemUp,
      handleClickMoveItemDown: this.handleClickMoveItemDown,
    }

    const items = this.state.items
    const id = `${className}_${items.length}_${Date.now()}`
    items.push(<FormContributor key={id} id={id} {..._props} />)
    this.setState({
      items,
    })
  }
  handleClickCreateContributor = () => {
    // console.log('! handleClickCreateContributor', this.index)
  }
  handleClickSelectContributor = () => {
    // console.log('! handleClickSelectContributor')
  }
  handleClickEditContributor = () => {
    // console.log('! handleClickEditContributor')
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
