import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import Textarea from './Textarea'
import Select from './Select'

import provide from 'react-redux-provide'
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
    id: number,
    idDescribedbyContributorBrowse: string,
    idDescribedByContributorMove: string,
    index: number,
    textBtnRemoveContributor: string,
    textBtnMoveContributorUp: string,
    textBtnMoveContributorDown: string,
    textBtnCreateContributor: string,
    textBtnEditContributor: string,
    textBtnSelectExistingContributors: string,
    textLabelContributorSearch: string,
    textLegendContributor: string,
    handleClickCreateContributor: func,
    handleClickEditContributor: func,
    handleClickSelectContributor: func,
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
    // REDUX/PROVIDE
    computeContributors: object.isRequired,
    createContributor: func.isRequired,
    splitWindowPath: array.isRequired,
    fetchDialect: func.isRequired,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    computeCreateContributor: object,
    computeContributor: object.isRequired,
    fetchContributors: func.isRequired,
  }
  static defaultProps = {
    id: 0,
    index: 0,
    componentState: 1,
    handleClickCreateContributor: () => {},
    handleClickEditContributor: () => {},
    handleClickSelectContributor: () => {},
    handleClickRemoveItem: () => {},
    handleClickMoveItemUp: () => {},
    handleClickMoveItemDown: () => {},
    DISABLED_SORT_COLS: ['state'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
  }
  state = {
    componentState: this.props.componentState,
    createContributorName: '',
    createContributorDescription: '',
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
      name,
      id,
      idDescribedbyContributorBrowse,
      idDescribedByContributorMove,
      index,
      textBtnRemoveContributor,
      textBtnMoveContributorUp,
      textBtnMoveContributorDown,
      textBtnCreateContributor,
      textBtnEditContributor,
      textBtnSelectExistingContributors,
      textLabelContributorSearch,
      textLegendContributor,
      // handleClickSelectContributor,
      handleClickRemoveItem,
      handleClickMoveItemUp,
      handleClickMoveItemDown,
      // value,
    } = this.props

    let componentContent = null

    const moveContributorBtns = (
      <div>
        {/* Move contributor */}
        <button
          aria-describedby={idDescribedByContributorMove}
          onClick={() => {
            handleClickMoveItemUp(id)
          }}
          type="button"
        >
          {textBtnMoveContributorUp}
        </button>

        {/* Move contributor */}
        <button
          aria-describedby={idDescribedByContributorMove}
          onClick={() => {
            handleClickMoveItemDown(id)
          }}
          type="button"
        >
          {textBtnMoveContributorDown}
        </button>
      </div>
    )
    const removeContributorBtn = (
      // Remove contributor
      <button
        onClick={() => {
          handleClickRemoveItem(id)
        }}
        type="button"
      >
        {textBtnRemoveContributor}
      </button>
    )
    switch (this.state.componentState) {
      case this.STATE_CREATE_CONTRIBUTOR:
        // CREATE A NEW CONTRIBUTOR ------------------------------------
        componentContent = (
          <div>
            <h2>Creating a new contributor</h2>

            {/* Name ------------- */}
            <Text
              className={`${className}__ContributorNewName`}
              id={`${className}__Contributor${index}__NewName`}
              labelText="Contributor name"
              name={`${name}[${index}]__NewName`}
              value=""
              handleChange={(_name) => {
                this.setState({ createContributorName: _name })
              }}
            />

            {/* Description ------------- */}
            <Textarea
              className={`${className}__ContributorNewDescription`}
              id={`${className}__Contributor${index}__NewDescription`}
              labelText="Contributor description"
              name={`${name}[${index}]__NewDescription`}
              value=""
              handleChange={(description) => {
                this.setState({ createContributorDescription: description })
              }}
            />

            {/* BTN: Create contributor ------------- */}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                this._handleCreateContributorSubmit()
              }}
            >
              Create new contributor
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
              Cancel and go back
            </button>
          </div>
        )
        break
      case this.STATE_CREATED_CONTRIBUTOR: {
        // CONTRIBUTOR CREATED ------------------------------------
        const { contributorUid } = this.state
        componentContent = (
          <fieldset>
            <legend>{textLegendContributor}</legend>

            <input type="hidden" name={`${name}[${index}]`} value={contributorUid} />
            <div>[CONTRIBUTOR ({contributorUid}) HERE]</div>

            {/* Edit contributor */}
            <button
              onClick={() => {
                this._handleClickEditContributor(id)
              }}
              type="button"
            >
              {textBtnEditContributor}
            </button>

            {removeContributorBtn}

            {moveContributorBtns}
          </fieldset>
        )
        break
      }
      case this.STATE_EDIT_CONTRIBUTOR:
        // EDITING A CONTRIBUTOR ------------------------------------
        componentContent = (
          <div>
            <h2>TODO: Editing contributor</h2>

            {/* Name ------------- */}
            <Text
              className={`${className}__ContributorEditName`}
              id={`${className}__Contributor${index}__EditName`}
              labelText="Contributor name"
              name={`${name}[${index}]__EditName`}
              value="[some prefilled value"
            />

            {/* Description ------------- */}
            <Textarea
              className={`${className}__ContributorEditDescription`}
              id={`${className}__Contributor${index}__EditDescription`}
              labelText="Contributor description"
              name={`${name}[${index}]__EditDescription`}
              value=""
            />

            {/* BTN: Create contributor ------------- */}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                this._handleCreateContributorSubmit()
              }}
            >
              Update contributor
            </button>

            {/* BTN: Cancel, go back ------------- */}
            <button
              type="button"
              onClick={() => {
                this.setState({
                  componentState: this.STATE_CREATED_CONTRIBUTOR,
                })
              }}
            >
              Cancel and go back
            </button>
          </div>
        )
        break
      case this.STATE_BROWSE_CONTRIBUTORS: {
        // BROWSING CONTRIBUTORS ------------------------------------
        const _computeContributors = ProviderHelpers.getEntry(this.props.computeContributors, this.CONTRIBUTOR_PATH)
        // const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.DIALECT_PATH)
        let contributors = []
        if (_computeContributors.response && _computeContributors.response.entries) {
          contributors = _computeContributors.response.entries.map((element, i) => {
            return (
              <option key={i} value={element.uid}>
                {element.title}, {element.type}, {element.state}
              </option>
            )
          })
        }
        componentContent = (
          <div>
            <Select
              className="FormContributor__NewContributorSelect"
              id="FormContributor__NewContributorSelect"
              labelText="Select from existing Contributors"
              name="FormContributor__NewContributorSelect"
              refSelect={(input) => {
                this.newContributorSelect = input
              }}
            >
              {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
              <optgroup>{contributors}</optgroup>
            </Select>

            {/* Save/select contributor ------------- */}
            <button
              type="button"
              onClick={() => {
                this.setState({
                  componentState: this.STATE_CREATED_CONTRIBUTOR,
                  contributorUid: this.newContributorSelect.value,
                })
              }}
            >
              Add selected Contributor
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
              Cancel and go back
            </button>
          </div>
        )
        break
      }
      default:
        // INITIAL STATE ------------------------------------
        componentContent = (
          <div>
            {/* Create contributor */}
            <button
              type="button"
              onClick={() => {
                this._handleClickCreateContributor()
              }}
            >
              {textBtnCreateContributor}
            </button>

            {/* Browse/select contributor */}
            <button
              aria-describedby={idDescribedbyContributorBrowse}
              onClick={() => {
                this._handleClickSelectContributor()
              }}
              type="button"
            >
              {textBtnSelectExistingContributors} (TODO)
            </button>

            {/* Search contributors */}
            <Text
              className={`${className}__Contributor`}
              id={`${className}__Contributor${index}`}
              labelText={textLabelContributorSearch}
              name={`${name}[${index}]`}
              value=""
            />

            {removeContributorBtn}

            {moveContributorBtns}
          </div>
        )
    }
    return (
      <fieldset>
        <legend>{textLegendContributor}</legend>
        {componentContent}
      </fieldset>
    )
  }
  _handleClickCreateContributor = () => {
    const { handleClickCreateContributor } = this.props
    this.setState(
      {
        componentState: this.STATE_CREATE_CONTRIBUTOR,
      },
      () => {
        // console.log('!', this.refs.ContributorNewName)
        // if (this.refs.ContributorNewName) {
        //   console.log('!!!!!! focusing!!!!!!!')
        //   this.refs.ContributorNewName.focus()
        // }
        handleClickCreateContributor()
      }
    )
  }
  _handleClickEditContributor = (id) => {
    const { handleClickEditContributor } = this.props
    this.setState(
      {
        componentState: this.STATE_EDIT_CONTRIBUTOR,
      },
      () => {
        handleClickEditContributor(id)
      }
    )
  }
  _handleClickSelectContributor = () => {
    const { handleClickSelectContributor } = this.props
    this.setState(
      {
        componentState: this.STATE_BROWSE_CONTRIBUTORS,
      },
      () => {
        handleClickSelectContributor()
      }
    )
  }
  _handleSubmitExistingContributor = (createContributorUid) => {
    this.setState(
      {
        componentState: this.STATE_CREATED_CONTRIBUTOR,
        contributorUid: createContributorUid,
      },
      () => {}
    )
  }

  async _handleCreateContributorSubmit() {
    const { createContributorName, createContributorDescription } = this.state
    if (createContributorName) {
      const now = Date.now()

      await this.props.createContributor(
        `${this.DIALECT_PATH}/Contributors`,
        {
          type: 'FVContributor',
          name: createContributorName,
          properties: { 'dc:title': createContributorName, 'dc:description': createContributorDescription },
        },
        null,
        now
      )

      const contributor = ProviderHelpers.getEntry(
        this.props.computeContributor,
        `${this.DIALECT_PATH}/Contributors/${createContributorName}.${now}`
      )
      const response = contributor.response
      if (response && response.uid) {
        this.setState({
          componentState: this.STATE_CREATED_CONTRIBUTOR,
          contributorUid: response.uid,
        })
      }
    }
  }
}

export default provide(FormContributor)
