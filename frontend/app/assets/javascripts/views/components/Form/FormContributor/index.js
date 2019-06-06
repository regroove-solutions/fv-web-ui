import React from 'react'
import { PropTypes } from 'react'

import copy from './internationalization'
import Text from 'views/components/Form/Common/Text'
import Textarea from 'views/components/Form/Common/Textarea'
import Select from 'views/components/Form/Common/Select'
import FormMoveButtons from 'views/components/Form/FormMoveButtons'
import FormRemoveButton from 'views/components/Form/FormRemoveButton'
import Description from 'views/components/Form/Common/Description'
import Preview from 'views/components/Editor/Preview'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createContributor, fetchContributors } from 'providers/redux/reducers/fvContributor'
import { fetchDialect } from 'providers/redux/reducers/fvDialect'

import ProviderHelpers from 'common/ProviderHelpers'
// import DocumentListView from 'views/components/Document/DocumentListView'
const { array, func, object, number, string } = PropTypes

export class FormContributor extends React.Component {
  STATE_DEFAULT = 1
  STATE_CREATE_CONTRIBUTOR = 2
  STATE_CREATED_CONTRIBUTOR = 3
  STATE_EDIT_CONTRIBUTOR = 4
  STATE_BROWSE_CONTRIBUTORS = 5

  static propTypes = {
    name: string,
    className: string,
    groupName: string,
    id: number,
    idDescribedbyItemBrowse: string,
    idDescribedByItemMove: string,
    index: number,
    textDescription: string,
    textLegendItem: string,
    textBtnRemoveItem: string,
    textBtnMoveItemUp: string,
    textBtnMoveItemDown: string,
    textBtnCreateItem: string,
    textBtnSelectExistingItems: string,
    textLabelItemSearch: string,
    textCreateTitle: string,
    textCreateTextLabelText: string,
    textCreateTextAreaLabelText: string,
    textCreateBtnSubmit: string,
    textCreateBtnCancel: string,
    textBrowseSelectLabelText: string,
    textBrowseBtnSubmit: string,
    textBrowseBtnCancel: string,
    handleClickCreateItem: func,
    handleClickSelectItem: func,
    handleClickRemoveItem: func,
    handleClickMoveItemUp: func,
    handleClickMoveItemDown: func,
    componentState: number,
    value: string,
    DISABLED_SORT_COLS: array,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    handleItemChange: func,
    // REDUX: reducers/state
    computeContributor: object.isRequired,
    computeCreateContributor: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    computeContributors: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createContributor: func.isRequired,
    fetchDialect: func.isRequired,
    fetchContributors: func.isRequired,
  }
  static defaultProps = {
    groupName: 'Form__group',
    id: 0,
    index: 0,
    componentState: 1,
    handleItemChange: () => {},
    handleClickCreateItem: () => {},
    handleClickSelectItem: () => {},
    handleClickRemoveItem: () => {},
    handleClickMoveItemUp: () => {},
    handleClickMoveItemDown: () => {},
    DISABLED_SORT_COLS: ['state'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
    textDescription: copy.description,
    textLegendItem: copy.legendItem,
    textBtnRemoveItem: copy.btnRemoveItem,
    textBtnMoveItemUp: copy.btnMoveItemUp,
    textBtnMoveItemDown: copy.btnMoveItemDown,
    textBtnCreateItem: copy.btnCreateItem,
    textBtnSelectExistingItems: copy.btnSelectExistingItems,
    textLabelItemSearch: copy.labelItemSearch,
    textCreateTitle: copy.create.title,
    textCreateTextLabelText: copy.create.textLabelText,
    textCreateTextAreaLabelText: copy.create.textAreaLabelText,
    textCreateBtnSubmit: copy.create.btnSubmit,
    textCreateBtnCancel: copy.create.btnCancel,
    textBrowseSelectLabelText: copy.browse.selectLabelText,
    textBrowseBtnSubmit: copy.browse.btnSubmit,
    textBrowseBtnCancel: copy.browse.btnCancel,
  }
  state = {
    componentState: this.props.componentState,
    createItemName: '',
    createItemDescription: '',
  }

  DIALECT_PATH = undefined
  CONTRIBUTOR_PATH = undefined

  // Fetch data on initial render
  async componentDidMount() {
    const { computeDialect, splitWindowPath } = this.props

    // USING this.DIALECT_PATH instead of setting state
    // this.setState({ dialectPath: dialectPath })
    this.DIALECT_PATH = ProviderHelpers.getDialectPathFromURLArray(splitWindowPath)
    this.CONTRIBUTOR_PATH = `${this.DIALECT_PATH}/Contributors`
    // Get data for computeDialect
    if (!computeDialect.success) {
      await this.props.fetchDialect('/' + this.DIALECT_PATH)
    }

    const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_TYPE, DEFAULT_SORT_COL } = this.props
    let currentAppliedFilter = '' // eslint-disable-line
    // if (filter.has('currentAppliedFilter')) {
    //   currentAppliedFilter = Object.values(filter.get('currentAppliedFilter').toJS()).join('')
    // }
    await this.props.fetchContributors(
      this.CONTRIBUTOR_PATH,
      `${currentAppliedFilter}&currentPageIndex=${DEFAULT_PAGE -
        1}&pageSize=${DEFAULT_PAGE_SIZE}&sortOrder=${DEFAULT_SORT_TYPE}&sortBy=${DEFAULT_SORT_COL}`
    )
  }

  //   AFTER SUBMITTING NEW CONTRIBUTOR
  // ProviderHelpers.getEntry(nextProps.computeContributor, this.state.contributorPath).response

  render() {
    const {
      className,
      // name,
      id,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      index,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textBtnCreateItem,
      textBtnSelectExistingItems,
      textLegendItem,
      handleClickRemoveItem,
      handleClickMoveItemUp,
      handleClickMoveItemDown,
    } = this.props

    let componentContent = null

    switch (this.state.componentState) {
      case this.STATE_CREATE_CONTRIBUTOR:
        // CREATE A NEW CONTRIBUTOR ------------------------------------
        componentContent = (
          <div>
            <h2>{this.props.textCreateTitle}</h2>

            {/* Name ------------- */}
            <Text
              className={this.props.groupName}
              id={`${className}__Contributor${index}__NewName`}
              labelText={this.props.textCreateTextLabelText}
              name="FormContributor.name"
              value=""
              handleChange={(_name) => {
                this.setState({ createItemName: _name })
              }}
            />

            {/* Description ------------- */}
            <Textarea
              className={this.props.groupName}
              id={`${className}__Contributor${index}__NewDescription`}
              labelText={this.props.textCreateTextAreaLabelText}
              name="FormContributor.description"
              value=""
              handleChange={(description) => {
                this.setState({ createItemDescription: description })
              }}
            />

            {/* BTN: Create contributor ------------- */}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                this._handleCreateItemSubmit()
              }}
            >
              {this.props.textCreateBtnSubmit}
            </button>

            {/* BTN: Cancel, go back ------------- */}
            <button
              type="button"
              onClick={() => {
                this.setState({
                  componentState: this.STATE_DEFAULT,
                })
              }}
            >
              {this.props.textCreateBtnCancel}
            </button>
          </div>
        )
        break
      case this.STATE_CREATED_CONTRIBUTOR: {
        // CONTRIBUTOR CREATED ------------------------------------
        const { contributorUid } = this.state
        componentContent = (
          <div className="Form__sidebar">
            <div className="Form__main">
              <Preview id={contributorUid} type="FVContributor" />
            </div>
            <div className="FormItemButtons Form__aside">
              <FormRemoveButton
                id={id}
                textBtnRemoveItem={textBtnRemoveItem}
                handleClickRemoveItem={handleClickRemoveItem}
              />
              <FormMoveButtons
                id={id}
                idDescribedByItemMove={idDescribedByItemMove}
                textBtnMoveItemUp={textBtnMoveItemUp}
                textBtnMoveItemDown={textBtnMoveItemDown}
                handleClickMoveItemUp={handleClickMoveItemUp}
                handleClickMoveItemDown={handleClickMoveItemDown}
              />
            </div>
          </div>
        )
        break
      }
      case this.STATE_BROWSE_CONTRIBUTORS: {
        // BROWSING CONTRIBUTORS ------------------------------------
        const _computeContributors = ProviderHelpers.getEntry(this.props.computeContributors, this.CONTRIBUTOR_PATH)
        // const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.DIALECT_PATH)
        let contributors = []
        let initialValue = null
        if (_computeContributors.response && _computeContributors.response.entries) {
          contributors = _computeContributors.response.entries.map((element, i) => {
            if (i === 0) {
              initialValue = element.uid
            }
            return (
              <option key={i} value={element.uid}>
                {element.title}, {element.type}, {element.state}
              </option>
            )
          })
        }
        componentContent = (
          <div className={this.props.groupName}>
            <Select
              className="FormContributor__NewContributorSelect"
              id="FormContributor__NewContributorSelect"
              labelText={this.props.textBrowseSelectLabelText}
              name="" // Note: intentionally generating invalid name so won't be picked up by `new FormData(this.form)`
              setRef={(input) => {
                this.newItemSelect = input
              }}
              value={initialValue}
            >
              {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
              <optgroup>{contributors}</optgroup>
            </Select>

            {/* Save/select contributor ------------- */}
            <button
              type="button"
              onClick={() => {
                const contributorUid = this.newItemSelect.value
                this.setState(
                  {
                    componentState: this.STATE_CREATED_CONTRIBUTOR,
                    contributorUid,
                  },
                  () => {
                    this.props.handleItemChange({
                      uid: contributorUid,
                      id: this.props.id,
                    })
                  }
                )
              }}
            >
              {this.props.textBrowseBtnSubmit}
            </button>

            {/* BTN: Cancel, go back ------------- */}
            <button
              type="button"
              onClick={() => {
                this.setState({
                  componentState: this.STATE_DEFAULT,
                })
              }}
            >
              {this.props.textBrowseBtnCancel}
            </button>
          </div>
        )
        break
      }
      default:
        // INITIAL STATE ------------------------------------
        componentContent = (
          <div className="Form__sidebar">
            <div className="Form__main">
              {/* Create contributor */}
              <button
                type="button"
                onClick={() => {
                  this._handleClickCreateItem()
                }}
              >
                {textBtnCreateItem}
              </button>

              {/* Browse/select contributor */}
              <button
                aria-describedby={idDescribedbyItemBrowse}
                onClick={() => {
                  this._handleClickSelectItem()
                }}
                type="button"
              >
                {textBtnSelectExistingItems}
              </button>

              {/* Search contributors */}
              {/* <Text
              className={this.props.groupName}
              id={`${className}__Contributor${index}`}
              labelText={textLabelItemSearch}
              name={`${name}[${index}]`}
              value=""
            /> */}
            </div>
            <div className="FormItemButtons Form__aside">
              <FormRemoveButton
                id={id}
                textBtnRemoveItem={textBtnRemoveItem}
                handleClickRemoveItem={handleClickRemoveItem}
              />
            </div>
          </div>
        )
    }
    return (
      <fieldset className={this.props.groupName}>
        <legend>{textLegendItem}</legend>
        <Description text={this.props.textDescription} />
        {componentContent}
      </fieldset>
    )
  }
  _handleClickCreateItem = () => {
    const { handleClickCreateItem } = this.props
    this.setState(
      {
        componentState: this.STATE_CREATE_CONTRIBUTOR,
      },
      () => {
        handleClickCreateItem()
      }
    )
  }
  _handleClickSelectItem = () => {
    const { handleClickSelectItem } = this.props
    this.setState(
      {
        componentState: this.STATE_BROWSE_CONTRIBUTORS,
      },
      () => {
        handleClickSelectItem()
      }
    )
  }
  _handleSubmitExistingItem = (createItemUid) => {
    this.setState(
      {
        componentState: this.STATE_CREATED_CONTRIBUTOR,
        contributorUid: createItemUid,
      },
      () => {
        this.props.handleItemChange({
          uid: createItemUid,
          id: this.props.id,
        })
      }
    )
  }

  async _handleCreateItemSubmit() {
    const { createItemName, createItemDescription } = this.state
    if (createItemName) {
      const now = Date.now()

      await this.props.createContributor(
        `${this.DIALECT_PATH}/Contributors`,
        {
          type: 'FVContributor',
          name: createItemName,
          properties: { 'dc:title': createItemName, 'dc:description': createItemDescription },
        },
        null,
        now
      )

      const contributor = ProviderHelpers.getEntry(
        this.props.computeContributor,
        `${this.DIALECT_PATH}/Contributors/${createItemName}.${now}`
      )
      const response = contributor.response
      if (response && response.uid) {
        this.setState(
          {
            componentState: this.STATE_CREATED_CONTRIBUTOR,
            contributorUid: response.uid,
          },
          () => {
            this.props.handleItemChange({
              uid: response.uid,
              id: this.props.id,
            })
          }
        )
      }
    }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvContributor, fvDialect, windowPath } = state

  const { computeContributor, computeContributors, computeCreateContributor } = fvContributor

  const { computeDialect, computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath

  return {
    computeContributor,
    computeCreateContributor,
    computeDialect,
    computeDialect2,
    computeContributors,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createContributor,
  fetchDialect,
  fetchContributors,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormContributor)
