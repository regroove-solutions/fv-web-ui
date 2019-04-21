import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import Textarea from './Textarea'
// import Select from './Select`'
import File from './File'
import Checkbox from './Checkbox'
import FormContributors from './FormContributors'
import FormRecorders from './FormRecorders'
import FormMoveButtons from './FormMoveButtons'
import FormRemoveButton from './FormRemoveButton'
import ProviderHelpers from 'common/ProviderHelpers'
import IntlService from 'views/services/intl'
// import DocumentListView from 'views/components/Document/DocumentListView'

// see about dropping:
import selectn from 'selectn'
import provide from 'react-redux-provide'
const intl = IntlService.instance
const { array, func, object, number, string, element } = PropTypes
export class FormRelatedAudioItem extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATE = 2
  STATE_CREATED = 3
  STATE_EDIT = 4
  STATE_BROWSE = 5

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
    textBtnEditItem: string,
    textBtnSelectExistingItems: string,
    textLabelItemSearch: string,
    textLegendItem: string,
    handleClickCreateItem: func,
    handleClickEditItem: func,
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
    DIALECT_PATH: string.isRequired,
    selectMediaComponent: element.isRequired,
    // NOTE: COMING FROM REDUX/PROVIDER
    computeAudio: object.isRequired,
    createAudio: func.isRequired,
    // NOTE: COMING FROM PARENT COMPONENT, NOT REDUX/PROVIDER
    computeDialectFromParent: object.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedAudioItem',
    groupName: 'FormRelatedAudioItem__group',
    id: 0,
    index: 0,
    componentState: 0,
    handleClickCreateItem: () => {},
    handleClickEditItem: () => {},
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
    selectMediaComponent: null,
  }
  state = {
    componentState: this.props.componentState,
    createItemName: '',
    createItemDescription: '',
    createItemFile: {},
    createItemIsShared: false,
    createItemIsChildFocused: false,
    createItemContributors: [],
    createItemRecorders: [],
    pathOrId: undefined,
  }

  CONTRIBUTOR_PATH = undefined

  //   AFTER SUBMITTING NEW CONTRIBUTOR
  // ProviderHelpers.getEntry(nextProps.computeContributor, this.state.contributorPath).response

  render() {
    const {
      className,
      name,
      id,
      // idDescribedbyItemBrowse,
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
      case this.STATE_CREATE: {
        const computeCreate = ProviderHelpers.getEntry(this.props.computeAudio, this.state.pathOrId)
        let formStatus = null
        if (computeCreate && computeCreate.isFetching) {
          formStatus = (
            <div className="alert alert-info">
              {intl.trans('views.components.editor.uploading_message', 'Uploading... Please be patient...', 'first')}
            </div>
          )
        }

        if (computeCreate && computeCreate.success) {
          formStatus = (
            <div className="alert alert-success">
              Upload successful!
              <button
                onClick={() => {
                  this._handleSelectElement(computeCreate.response)
                }}
              >
                {intl.trans('insert_into_entry', 'Insert into Entry', 'first')}
              </button>
            </div>
          )
        }

        // CREATE AUDIO ------------------------------------
        componentContent = (
          <div>
            <h2>Create new audio item</h2>
            {/* Name --------------- */}
            {/* <Text className="CreateAudio__Name" id="CreateAudio__Name" labelText="Name" name="dc:title" value="" /> */}

            {/* Name ------------- */}
            <Text
              className={this.props.groupName}
              id={`${className}__Contributor${index}__NewName`}
              labelText="Name of audio item"
              name={`${name}[${index}]__NewName`}
              value=""
              handleChange={(data) => {
                this.setState({ createItemName: data })
              }}
            />
            {/* Description --------------- */}
            <Textarea
              className={this.props.groupName}
              id="CreateAudio__Description"
              labelText="Description of audio item"
              name="dc:description"
              value=""
              handleChange={(data) => {
                this.setState({ createItemDescription: data })
              }}
            />

            {/* File --------------- */}
            <File
              className={this.props.groupName}
              id="CreateAudio__File"
              labelText="Upload audio item"
              name="file"
              value=""
              handleChange={(data) => {
                this.setState({ createItemFile: data })
              }}
            />

            {/* Shared --------------- */}
            <Checkbox
              className={this.props.groupName}
              id="CreateAudio__Shared"
              labelText="Share this audio across dialects"
              name="fvm:shared"
              handleChange={(data) => {
                this.setState({ createItemIsShared: data })
              }}
            />
            {/* Child focused --------------- */}
            <Checkbox
              className={this.props.groupName}
              id="CreateAudio__ChildFocused"
              labelText="Audio is child focused"
              name="fvm:child_focused"
              handleChange={(data) => {
                this.setState({ createItemIsChildFocused: data })
              }}
            />

            {/* Contributors: fvm:source --------------- */}
            <FormContributors
              className={this.props.groupName}
              name="fv:source"
              textInfo="Contributors who helped create the audio item."
              handleItemsUpdate={(data) => {
                this.setState({ createItemContributors: data })
              }}
            />

            {/* Recorders: fvm:recorder --------------- */}
            <FormRecorders
              className={this.props.groupName}
              name="fvm:recorder"
              textInfo="Recorders who helped create the audio item."
              handleItemsUpdate={(data) => {
                this.setState({ createItemRecorders: data })
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
              Create new audio item
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
              {"Cancel, don't create new audio item"}
            </button>
            {formStatus}
          </div>
        )
        break
      }
      case this.STATE_CREATED: {
        // AUDIO CREATED/SELECTED ------------------------------------
        const { audioUid } = this.state
        componentContent = (
          <fieldset className={this.props.groupName}>
            <legend>{textLegendItem}</legend>

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

            <input type="hidden" name={`${name}[${index}]`} value={audioUid} />
            <div>[AUDIO ({audioUid}) HERE]</div>
          </fieldset>
        )
        break
      }
      case this.STATE_EDIT:
        // EDITING A CONTRIBUTOR ------------------------------------
        componentContent = (
          <div>
            <h2>Editing contributor</h2>

            {/* Name ------------- */}
            <Text
              className={this.props.groupName}
              id={`${className}__Contributor${index}__EditName`}
              labelText="Related Audio Item name"
              name={`${name}[${index}]__EditName`}
              value="[some prefilled value]"
            />

            {/* Description ------------- */}
            <Textarea
              className={this.props.groupName}
              id={`${className}__Contributor${index}__EditDescription`}
              labelText="Related Audio Item description"
              name={`${name}[${index}]__EditDescription`}
              value=""
            />

            {/* BTN: Create contributor ------------- */}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                this._handleCreateItemSubmit()
              }}
            >
              Update contributor
            </button>

            {/* BTN: Cancel, go back ------------- */}
            <button
              type="button"
              onClick={() => {
                this.setState({
                  componentState: this.STATE_CREATED,
                })
              }}
            >
              {"Cancel, don't update contributor"}
            </button>
          </div>
        )
        break
      case this.STATE_BROWSE: {
        // TODO: REMOVE? USING OLD MODAL CODE INSTEAD
        // Select from existing audio  ------------------------------------

        // const { computeResourcesFromParent } = this.props
        // const _computeResources = ProviderHelpers.getEntry(computeResourcesFromParent, '/FV/Workspaces/')
        // const items =
        //   selectn('response.entries', _computeResources) || selectn('response_prev.entries', _computeResources) || []
        // let audioExisting = []

        // audioExisting = items.map((_element, i) => {
        //   const uid = _element.uid
        //   const audioId = `related_audio_${uid}`
        //   return (
        //     <div className={`${className}__browseItem`} key={i}>
        //       <div className={`${className}__browseItemGroup1`}>
        //         <input
        //           className={`${className}__browseItemRadio`}
        //           type="radio"
        //           id={audioId}
        //           name="related_audio"
        //           value={uid}
        //         />
        //       </div>
        //       <div className={`${className}__browseItemGroup2`}>
        //         <label htmlFor={audioId}>{`Select '${_element.title}'`}</label>
        //         <audio src={selectn('properties.file:content.data', _element)} preload="none" controls />
        //       </div>
        //     </div>
        //   )
        // })

        // componentContent = (
        //   <div>
        //     <div
        //       onChange={(event) => {
        //         this.setState({
        //           relatedAudioUid: event.target.value,
        //         })
        //       }}
        //     >
        //       {audioExisting}
        //     </div>

        //     {/* Save/select contributor ------------- */}
        //     <button
        //       type="button"
        //       disabled={this.state.relatedAudioUid === undefined}
        //       onClick={() => {
        //         this.setState({
        //           componentState: this.STATE_CREATED,
        //           audioUid: this.state.relatedAudioUid,
        //         })
        //       }}
        //     >
        //       Add selected Related Audio Item
        //     </button>

        //     {/* BTN: Cancel, go back ------------- */}
        //     <button
        //       type="button"
        //       onClick={() => {
        //         this.setState({
        //           componentState: this.STATE_DEFAULT,
        //         })
        //       }}
        //     >
        //       {"Cancel, don't add Related Audio Item"}
        //     </button>
        //   </div>
        // )
        break
      }
      default: {
        // INITIAL STATE ------------------------------------
        const { computeDialectFromParent, selectMediaComponent } = this.props
        const SelectMediaComponent = selectMediaComponent
        componentContent = (
          <div>
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
            {/* <button
              aria-describedby={idDescribedbyItemBrowse}
              onClick={() => {
                this._handleClickSelectItem()
              }}
              type="button"
            >
              {textBtnSelectExistingItems}
            </button> */}

            <SelectMediaComponent
              type={'FVAudio'}
              label={textBtnSelectExistingItems}
              onComplete={(selected) => {
                // eslint-disable-next-line
                console.log('!', selected)
                const uid = selectn('uid', selected)
                const path = selectn(['properties', 'file:content', 'data'], selected)
                const title = selectn(['title'], selected)
                // eslint-disable-next-line
                console.log('!!! onComplete', { uid, path, title })
              }}
              dialect={selectn('response', computeDialectFromParent)}
            />

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
    }
    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>{textLegendItem}</legend>
        {componentContent}
        <div style={{ display: 'none' }}>
          <div
            className={`md-modal md-effect-12 ${this.state.componentState === this.STATE_CREATE && 'md-show'}`}
            id="modal-12"
          >
            <div className="md-content">
              <div>
                <h2>Create new audio item</h2>
                {/* Name ------------- */}
                <Text
                  className={this.props.groupName}
                  id={`${className}__Contributor${index}__NewName`}
                  labelText="Name of audio item"
                  name={`${name}[${index}]__NewName`}
                  value=""
                  handleChange={(data) => {
                    this.setState({ createItemName: data })
                  }}
                />
                {/* Description --------------- */}
                <Textarea
                  className={this.props.groupName}
                  id="CreateAudio__Description"
                  labelText="Description of audio item"
                  name="dc:description"
                  value=""
                  handleChange={(data) => {
                    this.setState({ createItemDescription: data })
                  }}
                />

                {/* File --------------- */}
                <File
                  className={this.props.groupName}
                  id="CreateAudio__File"
                  labelText="Upload audio item"
                  name="file"
                  value=""
                  handleChange={(data) => {
                    this.setState({ createItemFile: data })
                  }}
                />

                {/* Shared --------------- */}
                <Checkbox
                  className={this.props.groupName}
                  id="CreateAudio__Shared"
                  labelText="Share this audio across dialects"
                  name="fvm:shared"
                  handleChange={(data) => {
                    this.setState({ createItemIsShared: data })
                  }}
                />
                {/* Child focused --------------- */}
                <Checkbox
                  className={this.props.groupName}
                  id="CreateAudio__ChildFocused"
                  labelText="Audio is child focused"
                  name="fvm:child_focused"
                  handleChange={(data) => {
                    this.setState({ createItemIsChildFocused: data })
                  }}
                />

                {/* Contributors: fvm:source --------------- */}
                <FormContributors
                  className={this.props.groupName}
                  name="fv:source"
                  textInfo="Contributors who helped create the audio item."
                  handleItemsUpdate={(data) => {
                    this.setState({ createItemContributors: data })
                  }}
                />

                {/* Recorders: fvm:recorder --------------- */}
                <FormRecorders
                  className={this.props.groupName}
                  name="fvm:recorder"
                  textInfo="Recorders who helped create the audio item."
                  handleItemsUpdate={(data) => {
                    this.setState({ createItemRecorders: data })
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
                  Create new audio item
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
                  {"Cancel, don't create new audio item"}
                </button>
              </div>
            </div>
          </div>
          <div className="md-overlay" />
        </div>
      </fieldset>
    )
  }
  _handleClickCreateItem = () => {
    const { handleClickCreateItem } = this.props
    this.setState(
      {
        componentState: this.STATE_CREATE,
      },
      () => {
        // console.log('!', this.refs.ItemNewName)
        // if (this.refs.ItemNewName) {
        //   console.log('!!!!!! focusing!!!!!!!')
        //   this.refs.ItemNewName.focus()
        // }
        handleClickCreateItem()
      }
    )
  }
  _handleClickEditItem = (id) => {
    const { handleClickEditItem } = this.props
    this.setState(
      {
        componentState: this.STATE_EDIT,
      },
      () => {
        handleClickEditItem(id)
      }
    )
  }
  _handleClickSelectItem = () => {
    const { handleClickSelectItem } = this.props
    this.setState(
      {
        componentState: this.STATE_BROWSE,
      },
      () => {
        handleClickSelectItem()
      }
    )
  }
  _handleSubmitExistingItem = (createItemUid) => {
    this.setState(
      {
        componentState: this.STATE_CREATED,
        contributorUid: createItemUid,
      },
      () => {}
    )
  }

  async _handleCreateItemSubmit() {
    const {
      createItemName,
      createItemDescription,
      createItemFile,
      createItemIsShared,
      createItemIsChildFocused,
      createItemContributors,
      createItemRecorders,
    } = this.state

    const docParams = {
      type: 'FVAudio',
      name: createItemName,
      properties: {
        'dc:title': createItemName,
        'dc:description': createItemDescription,
        'fvm:shared': createItemIsShared,
        'fvm:child_focused': createItemIsChildFocused,
        'fvm:recorder': createItemRecorders,
        'fvm:source': createItemContributors,
      },
    }

    const timestamp = Date.now()
    const { DIALECT_PATH } = this.props
    this.props.createAudio(`${DIALECT_PATH}/Resources`, docParams, createItemFile, timestamp)
    const pathOrId = `${DIALECT_PATH}/Resources/${createItemName}.${timestamp}`
    this.setState({ pathOrId })
  }
}

export default provide(FormRelatedAudioItem)
