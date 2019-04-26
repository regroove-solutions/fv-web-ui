import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import Textarea from './Textarea'
import Select from './Select'
import FormMoveButtons from './FormMoveButtons'
import FormRemoveButton from './FormRemoveButton'
import provide from 'react-redux-provide'
import ProviderHelpers from 'common/ProviderHelpers'
import Preview from 'views/components/Editor/Preview'
// import DocumentListView from 'views/components/Document/DocumentListView'
const { array, func, object, number, string } = PropTypes

export class FormRecorder extends React.Component {
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
    textBtnRemoveItem: string,
    textBtnMoveItemUp: string,
    textBtnMoveItemDown: string,
    textBtnCreateItem: string,
    // textBtnEditItem: string,
    textBtnSelectExistingItems: string,
    textLabelItemSearch: string,
    textLegendItem: string,
    handleClickCreateItem: func,
    // handleClickEditItem: func,
    handleClickSelectItem: func,
    handleClickRemoveItem: func,
    handleClickMoveItemUp: func,
    handleClickMoveItemDown: func,
    handleItemChange: func,
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
    groupName: 'FormRecorder__group',
    id: 0,
    index: 0,
    componentState: 1,
    handleClickCreateItem: () => {},
    // handleClickEditItem: () => {},
    handleClickSelectItem: () => {},
    handleClickRemoveItem: () => {},
    handleClickMoveItemUp: () => {},
    handleClickMoveItemDown: () => {},
    handleItemChange: () => {},
    DISABLED_SORT_COLS: ['state'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
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
      name,
      id,
      idDescribedbyItemBrowse,
      idDescribedByItemMove,
      index,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textBtnCreateItem,
      // textBtnEditItem,
      textBtnSelectExistingItems,
      // textLabelItemSearch,
      textLegendItem,
      // handleClickSelectItem,
      handleClickRemoveItem,
      handleClickMoveItemUp,
      handleClickMoveItemDown,
      // value,
    } = this.props

    let componentContent = null

    switch (this.state.componentState) {
      case this.STATE_CREATE_CONTRIBUTOR:
        // CREATE A NEW CONTRIBUTOR ------------------------------------
        componentContent = (
          <div className={this.props.groupName}>
            <h2>Creating a new recorder</h2>

            {/* Name ------------- */}
            <Text
              className={this.props.groupName}
              id={`${className}__Recorder${index}__NewName`}
              labelText="Recorder name"
              name={`${name}[${index}]__NewName`}
              value=""
              handleChange={(_name) => {
                this.setState({ createItemName: _name })
              }}
            />

            {/* Description ------------- */}
            <Textarea
              className={this.props.groupName}
              id={`${className}__Recorder${index}__NewDescription`}
              labelText="Recorder description"
              name={`${name}[${index}]__NewDescription`}
              value=""
              handleChange={(description) => {
                this.setState({ createItemDescription: description })
              }}
            />

            {/* BTN: Create recorder ------------- */}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                this._handleCreateItemSubmit()
              }}
            >
              Create new recorder
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
              {"Cancel, don't create a new recorder"}
            </button>
          </div>
        )
        break
      case this.STATE_CREATED_CONTRIBUTOR: {
        // CONTRIBUTOR CREATED ------------------------------------
        const { itemUid } = this.state
        componentContent = (
          <div>
            <div className="FormItemButtons">
              <FormMoveButtons
                id={id}
                idDescribedByItemMove={idDescribedByItemMove}
                textBtnMoveItemUp={textBtnMoveItemUp}
                textBtnMoveItemDown={textBtnMoveItemDown}
                handleClickMoveItemUp={handleClickMoveItemUp}
                handleClickMoveItemDown={handleClickMoveItemDown}
              />
              <FormRemoveButton
                id={id}
                textBtnRemoveItem={textBtnRemoveItem}
                handleClickRemoveItem={handleClickRemoveItem}
              />
            </div>
            <input type="hidden" name={`${name}[${index}]`} value={itemUid} />
            <Preview id={itemUid} type="FVContributor" />

            {/* Edit recorder */}
            {/* <button
              onClick={() => {
                this._handleClickEditItem(id)
              }}
              type="button"
            >
              {textBtnEditItem}
            </button> */}
          </div>
        )
        break
      }
      // case this.STATE_EDIT_CONTRIBUTOR:
      //   // EDITING A CONTRIBUTOR ------------------------------------
      //   componentContent = (
      //     <div className={this.props.groupName}>
      //       <h2>Editing recorder</h2>

      //       {/* Name ------------- */}
      //       <Text
      //         className={this.props.groupName}
      //         id={`${className}__Recorder${index}__EditName`}
      //         labelText="Recorder name"
      //         name={`${name}[${index}]__EditName`}
      //         value="[some prefilled value"
      //       />

      //       {/* Description ------------- */}
      //       <Textarea
      //         className={this.props.groupName}
      //         id={`${className}__Recorder${index}__EditDescription`}
      //         labelText="Recorder description"
      //         name={`${name}[${index}]__EditDescription`}
      //         value=""
      //       />

      //       {/* BTN: Create recorder ------------- */}
      //       <button
      //         type="button"
      //         onClick={(event) => {
      //           event.preventDefault()
      //           this._handleCreateItemSubmit()
      //         }}
      //       >
      //         Update recorder
      //       </button>

      //       {/* BTN: Cancel, go back ------------- */}
      //       <button
      //         type="button"
      //         onClick={() => {
      //           this.setState({
      //             componentState: this.STATE_CREATED_CONTRIBUTOR,
      //           })
      //         }}
      //       >
      //         {"Cancel, don't update a recorder"}
      //       </button>
      //     </div>
      //   )
      //   break
      case this.STATE_BROWSE_CONTRIBUTORS: {
        // BROWSING CONTRIBUTORS ------------------------------------
        const _computeContributors = ProviderHelpers.getEntry(this.props.computeContributors, this.CONTRIBUTOR_PATH)
        // const _computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.DIALECT_PATH)
        let items = []
        let initialValue = null
        if (_computeContributors.response && _computeContributors.response.entries) {
          items = _computeContributors.response.entries.map((element, i) => {
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
              className="FormRecorder__NewRecorderSelect"
              id="FormRecorder__NewRecorderSelect"
              labelText="Select from existing Recorders"
              name="FormRecorder__NewRecorderSelect"
              refSelect={(input) => {
                this.newItemSelect = input
              }}
              value={initialValue}
            >
              {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
              <optgroup>{items}</optgroup>
            </Select>

            {/* Save/select recorder ------------- */}
            <button
              type="button"
              onClick={() => {
                const recorderId = this.newItemSelect.value
                this.setState(
                  {
                    componentState: this.STATE_CREATED_CONTRIBUTOR,
                    itemUid: recorderId,
                  },
                  () => {
                    this.props.handleItemChange({
                      uid: recorderId,
                      id: this.props.id,
                    })
                  }
                )
              }}
            >
              Add selected Recorder
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
              {"Cancel, don't add a recorder"}
            </button>
          </div>
        )
        break
      }
      default:
        // INITIAL STATE ------------------------------------
        componentContent = (
          <div>
            {/* Create recorder */}
            <button
              type="button"
              onClick={() => {
                this._handleClickCreateItem()
              }}
            >
              {textBtnCreateItem}
            </button>

            {/* Browse/select recorder */}
            <button
              aria-describedby={idDescribedbyItemBrowse}
              onClick={() => {
                this._handleClickSelectItem()
              }}
              type="button"
            >
              {textBtnSelectExistingItems}
            </button>

            {/* Search recorders */}
            {/* <Text
              className={`${className}__Recorder`}
              id={`${className}__Recorder${index}`}
              labelText={textLabelItemSearch}
              name={`${name}[${index}]`}
              value=""
            /> */}

            <div className="FormItemButtons">
              <FormMoveButtons
                id={id}
                idDescribedByItemMove={idDescribedByItemMove}
                textBtnMoveItemUp={textBtnMoveItemUp}
                textBtnMoveItemDown={textBtnMoveItemDown}
                handleClickMoveItemUp={handleClickMoveItemUp}
                handleClickMoveItemDown={handleClickMoveItemDown}
              />
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
  // _handleClickEditItem = (id) => {
  //   const { handleClickEditItem } = this.props
  //   this.setState(
  //     {
  //       componentState: this.STATE_EDIT_CONTRIBUTOR,
  //     },
  //     () => {
  //       handleClickEditItem(id)
  //     }
  //   )
  // }
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
  // _handleSubmitExistingItem = (createItemUid) => {
  //   this.setState(
  //     {
  //       componentState: this.STATE_CREATED_CONTRIBUTOR,
  //       itemUid: createItemUid,
  //     },
  //     () => {
  //       console.log('! 2', createItemUid)
  //       this.props.handleItemChange({
  //         uid: createItemUid,
  //         id: this.props.id,
  //       })
  //     }
  //   )
  // }

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

      const item = ProviderHelpers.getEntry(
        this.props.computeContributor,
        `${this.DIALECT_PATH}/Contributors/${createItemName}.${now}`
      )
      const response = item.response
      if (response && response.uid) {
        const createItemUid = response.uid
        this.setState(
          {
            componentState: this.STATE_CREATED_CONTRIBUTOR,
            itemUid: createItemUid,
          },
          () => {
            this.props.handleItemChange({
              uid: createItemUid,
              id: this.props.id,
            })
          }
        )
      }
    }
  }
}

export default provide(FormRecorder)
