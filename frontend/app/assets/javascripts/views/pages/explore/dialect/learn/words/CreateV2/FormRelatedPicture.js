import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import Textarea from './Textarea'
// import Select from './Select`'
import File from './File'
import Checkbox from './Checkbox'
import FormContributors from './FormContributors'
// import FormRecorders from './FormRecorders'
import FormMoveButtons from './FormMoveButtons'
import FormRemoveButton from './FormRemoveButton'

import ProviderHelpers from 'common/ProviderHelpers'
import IntlService from 'views/services/intl'
// import DocumentListView from 'views/components/Document/DocumentListView'
import Preview from 'views/components/Editor/Preview'
// see about dropping:
import selectn from 'selectn'
import provide from 'react-redux-provide'
const intl = IntlService.instance
const { array, func, object, number, string, element } = PropTypes
export class FormRelatedPicture extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATE = 2
  STATE_CREATED = 3
  // STATE_EDIT = 4
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
    handleItemSelected: func,
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
    computePicture: object.isRequired,
    createPicture: func.isRequired,
    // NOTE: COMING FROM PARENT COMPONENT, NOT REDUX/PROVIDER
    computeDialectFromParent: object.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedPicture',
    groupName: 'FormRelatedPicture__group',
    id: -1,
    index: 0,
    componentState: 0,
    handleClickCreateItem: () => {},
    // handleClickEditItem: () => {},
    handleClickSelectItem: () => {},
    handleClickRemoveItem: () => {},
    handleClickMoveItemUp: () => {},
    handleClickMoveItemDown: () => {},
    handleItemSelected: () => {},
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
    const computeCreate = ProviderHelpers.getEntry(this.props.computePicture, this.state.pathOrId)
    const isFetching = selectn('isFetching', computeCreate)
    const isSuccess = selectn('success', computeCreate)
    // let createdUid = null
    // let createdTitle = null
    // let createdPath = null
    // if (isSuccess) {
    //   createdUid = selectn(['response', 'uid'], computeCreate)
    //   createdTitle = selectn(['response', 'title'], computeCreate)
    //   createdPath = selectn(['response', 'path'], computeCreate)
    // }
    const _handleItemSelectedOrCreated = (selected) => {
      this.props.handleItemSelected(selected, () => {
        handleClickRemoveItem(id)
      })
    }

    if (isSuccess) {
      // Note: deletes the in-progress/newly added item and inserts the just created item
      _handleItemSelectedOrCreated(selectn('response', computeCreate))
    }

    switch (this.state.componentState) {
      case this.STATE_CREATE: {
        let formStatus = null
        if (isFetching) {
          formStatus = (
            <div className="alert alert-info">
              {intl.trans('views.components.editor.uploading_message', 'Uploading... Please be patient...', 'first')}
            </div>
          )
        }

        // CREATE AUDIO ------------------------------------
        componentContent = (
          <div>
            <h2>Create new picture</h2>
            {/* Name ------------- */}
            <Text
              className={this.props.groupName}
              id={`${className}__Contributor${index}__NewName`}
              labelText="Name of picture"
              name={`${name}[${index}]__NewName`}
              value=""
              handleChange={(data) => {
                this.setState({ createItemName: data })
              }}
            />
            {/* Description --------------- */}
            <Textarea
              className={this.props.groupName}
              id="CreatePicture__Description"
              labelText="Description of picture"
              name="dc:description"
              value=""
              handleChange={(data) => {
                this.setState({ createItemDescription: data })
              }}
            />

            {/* File --------------- */}
            <File
              className={this.props.groupName}
              id="CreatePicture__File"
              labelText="Upload picture"
              name="file"
              value=""
              handleChange={(data) => {
                this.setState({ createItemFile: data })
              }}
            />

            {/* Shared --------------- */}
            <Checkbox
              className={this.props.groupName}
              id="CreatePicture__Shared"
              labelText="Share this picture across dialects"
              name="fvm:shared"
              handleChange={(data) => {
                this.setState({ createItemIsShared: data })
              }}
            />
            {/* Child focused --------------- */}
            <Checkbox
              className={this.props.groupName}
              id="CreatePicture__ChildFocused"
              labelText="Picture is child focused"
              name="fvm:child_focused"
              handleChange={(data) => {
                this.setState({ createItemIsChildFocused: data })
              }}
            />

            {/* Contributors: fvm:source --------------- */}
            <FormContributors
              className={this.props.groupName}
              name="fv:source"
              textInfo="Contributors who helped create the picture."
              handleItemsUpdate={(data) => {
                this.setState({ createItemContributors: data })
              }}
            />

            {/* Recorders: fvm:recorder --------------- */}
            {/* <FormRecorders
              className={this.props.groupName}
              name="fvm:recorder"
              textInfo="Recorders who helped create the picture."
              handleItemsUpdate={(data) => {
                this.setState({ createItemRecorders: data })
              }}
            /> */}

            {/* BTN: Create contributor ------------- */}
            <button
              disabled={isFetching || isSuccess}
              type="button"
              onClick={(event) => {
                event.preventDefault()
                this._handleCreateItemSubmit()
              }}
            >
              Create new picture
            </button>

            {/* BTN: Cancel, go back ------------- */}
            <button
              disabled={isFetching || isSuccess}
              type="button"
              onClick={() => {
                this.setState({
                  componentState: this.STATE_DEFAULT,
                })
              }}
            >
              {"Cancel, don't create new picture"}
            </button>
            {formStatus}
          </div>
        )
        break
      }
      case this.STATE_CREATED: {
        // AUDIO CREATED/SELECTED ------------------------------------
        let previewInput = 'Something went wrong!'
        if (id !== -1) {
          previewInput = (
            <div>
              <input type="hidden" name={`${name}[${index}]`} value={id} />
              <Preview id={id} type="FVPicture" />
            </div>
          )
        }
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
            {previewInput}
          </div>
        )
        break
      }
      // case this.STATE_EDIT:
      //   // EDITING A CONTRIBUTOR ------------------------------------
      //   componentContent = (
      //     <div>
      //       <h2>Editing contributor</h2>

      //       {/* Name ------------- */}
      //       <Text
      //         className={this.props.groupName}
      //         id={`${className}__Contributor${index}__EditName`}
      //         labelText="Related Picture name"
      //         name={`${name}[${index}]__EditName`}
      //         value="[some prefilled value]"
      //       />

      //       {/* Description ------------- */}
      //       <Textarea
      //         className={this.props.groupName}
      //         id={`${className}__Contributor${index}__EditDescription`}
      //         labelText="Related Picture description"
      //         name={`${name}[${index}]__EditDescription`}
      //         value=""
      //       />

      //       {/* BTN: Create contributor ------------- */}
      //       <button
      //         type="button"
      //         onClick={(event) => {
      //           event.preventDefault()
      //           this._handleCreateItemSubmit()
      //         }}
      //       >
      //         Update contributor
      //       </button>

      //       {/* BTN: Cancel, go back ------------- */}
      //       <button
      //         type="button"
      //         onClick={() => {
      //           this.setState({
      //             componentState: this.STATE_CREATED,
      //           })
      //         }}
      //       >
      //         {"Cancel, don't update contributor"}
      //       </button>
      //     </div>
      //   )
      //   break
      // case this.STATE_BROWSE: {
      //   // TODO: REMOVE? USING OLD MODAL CODE INSTEAD
      //   // Select from existing audio  ------------------------------------

      //   const { computeResourcesFromParent } = this.props
      //   const _computeResources = ProviderHelpers.getEntry(computeResourcesFromParent, '/FV/Workspaces/')
      //   const items =
      //     selectn('response.entries', _computeResources) || selectn('response_prev.entries', _computeResources) || []
      //   let audioExisting = []

      //   audioExisting = items.map((_element, i) => {
      //     const uid = _element.uid
      //     const audioId = `related_audio_${uid}`
      //     return (
      //       <div className={`${className}__browseItem`} key={i}>
      //         <div className={`${className}__browseItemGroup1`}>
      //           <input
      //             className={`${className}__browseItemRadio`}
      //             type="radio"
      //             id={audioId}
      //             name="related_audio"
      //             value={uid}
      //           />
      //         </div>
      //         <div className={`${className}__browseItemGroup2`}>
      //           <label htmlFor={audioId}>{`Select '${_element.title}'`}</label>
      //           <audio src={selectn('properties.file:content.data', _element)} preload="none" controls />
      //         </div>
      //       </div>
      //     )
      //   })

      //   componentContent = (
      //     <div>
      //       <div
      //         onChange={(event) => {
      //           this.setState({
      //             relatedAudioUid: event.target.value,
      //           })
      //         }}
      //       >
      //         {audioExisting}
      //       </div>

      //       {/* Save/select contributor ------------- */}
      //       <button
      //         type="button"
      //         disabled={this.state.relatedAudioUid === undefined}
      //         onClick={() => {
      //           this.setState({
      //             componentState: this.STATE_CREATED,
      //             audioUid: this.state.relatedAudioUid,
      //           })
      //         }}
      //       >
      //         Add selected Related Picture
      //       </button>

      //       {/* BTN: Cancel, go back ------------- */}
      //       <button
      //         type="button"
      //         onClick={() => {
      //           this.setState({
      //             componentState: this.STATE_DEFAULT,
      //           })
      //         }}
      //       >
      //         {"Cancel, don't add Related Picture"}
      //       </button>
      //     </div>
      //   )
      //   break
      // }
      default: {
        // INITIAL STATE ------------------------------------
        const { computeDialectFromParent, selectMediaComponent } = this.props
        const SelectMediaComponent = selectMediaComponent
        componentContent = (
          <div>
            <div className="FormItemButtons">
              {/* <FormMoveButtons
                id={id}
                idDescribedByItemMove={idDescribedByItemMove}
                textBtnMoveItemUp={textBtnMoveItemUp}
                textBtnMoveItemDown={textBtnMoveItemDown}
                handleClickMoveItemUp={handleClickMoveItemUp}
                handleClickMoveItemDown={handleClickMoveItemDown}
              /> */}
              <FormRemoveButton
                id={id}
                textBtnRemoveItem={textBtnRemoveItem}
                handleClickRemoveItem={handleClickRemoveItem}
              />
            </div>
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
              type={'FVPicture'}
              label={textBtnSelectExistingItems}
              onComplete={_handleItemSelectedOrCreated}
              dialect={selectn('response', computeDialectFromParent)}
            />
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
                <h2>Create new picture</h2>
                {/* Name ------------- */}
                <Text
                  className={this.props.groupName}
                  id={`${className}__Contributor${index}__NewName`}
                  labelText="Name of picture"
                  name={`${name}[${index}]__NewName`}
                  value=""
                  handleChange={(data) => {
                    this.setState({ createItemName: data })
                  }}
                />
                {/* Description --------------- */}
                <Textarea
                  className={this.props.groupName}
                  id="CreatePicture__Description"
                  labelText="Description of picture"
                  name="dc:description"
                  value=""
                  handleChange={(data) => {
                    this.setState({ createItemDescription: data })
                  }}
                />

                {/* File --------------- */}
                <File
                  className={this.props.groupName}
                  id="CreatePicture__File"
                  labelText="Upload picture"
                  name="file"
                  value=""
                  handleChange={(data) => {
                    this.setState({ createItemFile: data })
                  }}
                />

                {/* Shared --------------- */}
                <Checkbox
                  className={this.props.groupName}
                  id="CreatePicture__Shared"
                  labelText="Share this picture across dialects"
                  name="fvm:shared"
                  handleChange={(data) => {
                    this.setState({ createItemIsShared: data })
                  }}
                />
                {/* Child focused --------------- */}
                <Checkbox
                  className={this.props.groupName}
                  id="CreatePicture__ChildFocused"
                  labelText="Picture is child focused"
                  name="fvm:child_focused"
                  handleChange={(data) => {
                    this.setState({ createItemIsChildFocused: data })
                  }}
                />

                {/* Contributors: fvm:source --------------- */}
                <FormContributors
                  className={this.props.groupName}
                  name="fv:source"
                  textInfo="Contributors who helped create the picture."
                  handleItemsUpdate={(data) => {
                    this.setState({ createItemContributors: data })
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
                  Create new picture
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
                  {"Cancel, don't create new picture"}
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
        handleClickCreateItem()
      }
    )
  }
  // _handleClickEditItem = (id) => {
  //   const { handleClickEditItem } = this.props
  //   this.setState(
  //     {
  //       componentState: this.STATE_EDIT,
  //     },
  //     () => {
  //       handleClickEditItem(id)
  //     }
  //   )
  // }
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
      //   createItemRecorders,
    } = this.state

    const docParams = {
      type: 'FVPicture',
      name: createItemName,
      properties: {
        'dc:title': createItemName,
        'dc:description': createItemDescription,
        'fvm:shared': createItemIsShared,
        'fvm:child_focused': createItemIsChildFocused,
        'fvm:recorder': [], // createItemRecorders['fvm:recorder'],
        'fvm:source': createItemContributors['fvm:source'],
      },
    }

    const timestamp = Date.now()
    const { DIALECT_PATH } = this.props
    this.props.createPicture(`${DIALECT_PATH}/Resources`, docParams, createItemFile, timestamp)
    const pathOrId = `${DIALECT_PATH}/Resources/${createItemName}.${timestamp}`
    this.setState({ pathOrId })
  }
}

export default provide(FormRelatedPicture)
