/* eslint-disable */

import React from 'react'
import { PropTypes } from 'react'
import Text from 'views/components/Form/Common/Text'
import Textarea from 'views/components/Form/Common/Textarea'
// import Select from 'views/components/Form/Common/Select`'
import File from 'views/components/Form/Common/File'
import Checkbox from 'views/components/Form/Common/Checkbox'
import FormContributors from 'views/components/Form/FormContributors'
import FormRecorders from 'views/components/Form/FormRecorders'
// import FormMoveButtons from 'views/components/Form/FormMoveButtons'
// import FormRemoveButton from 'views/components/Form/FormRemoveButton'

// import ProviderHelpers from 'common/ProviderHelpers'
import IntlService from 'views/services/intl'

// import Preview from 'views/components/Editor/Preview'
// see about dropping:
// import selectn from 'selectn'
import provide from 'react-redux-provide'
const intl = IntlService.instance
const { array, func, object, number, string, element } = PropTypes
const STATE_UNAVAILABLE = 0
const STATE_DEFAULT = 1
const STATE_ERROR = 2
const STATE_SUCCESS = 3

const Wrapper = (props) => {
  const { className, groupName, textLegendItem } = props
  return (
    <fieldset className={`${className} ${groupName}`}>
      <legend>{textLegendItem}</legend>
      {props.children}
    </fieldset>
  )
}

export class CreateAudio extends React.Component {
  static propTypes = {
    className: string,
    id: number,
    groupName: string,

    // idDescribedbyItemBrowse: string,
    // idDescribedByItemMove: string,
    // index: number,
    // textBtnRemoveItem: string,
    // textBtnMoveItemUp: string,
    // textBtnMoveItemDown: string,
    // textBtnCreateItem: string,
    // textBtnSelectExistingItems: string,
    // textLabelItemSearch: string,
    // textLegendItem: string,
    // handleClickCreateItem: func,
    // handleClickSelectItem: func,
    // handleClickRemoveItem: func,
    // handleClickMoveItemUp: func,
    // handleClickMoveItemDown: func,
    // handleItemSelected: func,
    // componentState: number,
    // value: string,
    // DISABLED_SORT_COLS: array,
    // DEFAULT_PAGE: number,
    // DEFAULT_PAGE_SIZE: number,
    // DEFAULT_LANGUAGE: string,
    // DEFAULT_SORT_COL: string,
    // DEFAULT_SORT_TYPE: string,
    // DIALECT_PATH: string.isRequired,
    // selectMediaComponent: element.isRequired,

    // NOTE: COMING FROM REDUX/PROVIDER
    // computeAudio: object.isRequired,
    // createAudio: func.isRequired,
    // NOTE: COMING FROM PARENT COMPONENT, NOT REDUX/PROVIDER
    // computeDialectFromParent: object.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedAudioItem',
    id: -1,
    groupName: 'Form__group',

    // index: 0,
    // componentState: 0,
    // handleClickCreateItem: () => {},
    // handleClickSelectItem: () => {},
    // handleClickRemoveItem: () => {},
    // handleClickMoveItemUp: () => {},
    // handleClickMoveItemDown: () => {},
    // handleItemSelected: () => {},
    // DISABLED_SORT_COLS: ['state'],
    // DEFAULT_PAGE: 1,
    // DEFAULT_PAGE_SIZE: 100,
    // DEFAULT_LANGUAGE: 'english',
    // DEFAULT_SORT_COL: 'dc:title',
    // DEFAULT_SORT_TYPE: 'asc',
    // selectMediaComponent: null,
  }
  state = {
    componentState: STATE_UNAVAILABLE,
    // createItemName: '',
    // createItemDescription: '',
    // createItemFile: {},
    // createItemIsShared: false,
    // createItemIsChildFocused: false,
    // createItemContributors: [],
    // createItemRecorders: [],
    // pathOrId: undefined,
  }

  componentDidMount() {
    // Do any loading here...

    // Flip to ready state...

    // To fake loading:
    // setTimeout(() => {
    //   this.setState({
    //     componentState: STATE_DEFAULT,
    //   })
    // }, 2000)

    this.setState({
      componentState: STATE_DEFAULT,
    })
  }

  render() {
    // const {
    //   className,
    //   // name,
    //   id,
    //   idDescribedByItemMove,
    //   index,
    //   textBtnRemoveItem,
    //   textBtnMoveItemUp,
    //   textBtnMoveItemDown,
    //   textBtnCreateItem,
    //   textBtnSelectExistingItems,
    //   textLegendItem,
    //   handleClickRemoveItem,
    //   handleClickMoveItemUp,
    //   handleClickMoveItemDown,
    // } = this.props

    // let componentContent = null
    // const computeCreate = ProviderHelpers.getEntry(this.props.computeAudio, this.state.pathOrId)
    // const isFetching = selectn('isFetching', computeCreate)
    // const isSuccess = selectn('success', computeCreate)

    // const _handleItemSelectedOrCreated = (selected) => {
    //   this.props.handleItemSelected(selected, () => {
    //     handleClickRemoveItem(id)
    //   })
    // }

    // if (isSuccess) {
    //   // Note: deletes the in-progress/newly added item and inserts the just created item
    //   _handleItemSelectedOrCreated(selectn('response', computeCreate))
    // }

    // switch (this.state.componentState) {
    //   case this.STATE_CREATE: {
    //     let formStatus = null
    //     if (isFetching) {
    //       formStatus = (
    //         <div className="alert alert-info">
    //           {intl.trans('views.components.editor.uploading_message', 'Uploading... Please be patient...', 'first')}
    //         </div>
    //       )
    //     }

    //     // CREATE AUDIO ------------------------------------
    //     componentContent = (
    //       <div>
    //         <h2>Create new audio item</h2>
    //         {/* Name ------------- */}
    //         <Text
    //           className={this.props.groupName}
    //           id={`${className}__Contributor${index}__NewName`}
    //           labelText="Name of audio item"
    //           // name={`${name}[${index}]__NewName`}
    //           name="FormRelatedAudioItem.name"
    //           value=""
    //           handleChange={(data) => {
    //             this.setState({ createItemName: data })
    //           }}
    //         />
    //         {/* Description --------------- */}
    //         <Textarea
    //           className={this.props.groupName}
    //           id="CreateAudio__Description"
    //           labelText="Description of audio item"
    //           // name="dc:description"
    //           name="FormRelatedAudioItem.description"
    //           value=""
    //           handleChange={(data) => {
    //             this.setState({ createItemDescription: data })
    //           }}
    //         />

    //         {/* File --------------- */}
    //         <File
    //           className={this.props.groupName}
    //           id="CreateAudio__File"
    //           labelText="Upload audio item"
    //           // name="file"
    //           name=""
    //           value=""
    //           handleChange={(data) => {
    //             this.setState({ createItemFile: data })
    //           }}
    //         />

    //         {/* Shared --------------- */}
    //         <Checkbox
    //           className={this.props.groupName}
    //           id="CreateAudio__Shared"
    //           labelText="Share this audio across dialects"
    //           // name="fvm:shared"
    //           name=""
    //           handleChange={(data) => {
    //             this.setState({ createItemIsShared: data })
    //           }}
    //         />
    //         {/* Child focused --------------- */}
    //         <Checkbox
    //           className={this.props.groupName}
    //           id="CreateAudio__ChildFocused"
    //           labelText="Audio is child focused"
    //           // name="fvm:child_focused"
    //           name=""
    //           handleChange={(data) => {
    //             this.setState({ createItemIsChildFocused: data })
    //           }}
    //         />

    //         {/* Contributors: fvm:source --------------- */}
    //         <FormContributors
    //           className={this.props.groupName}
    //           // name="fv:source"
    //           name=""
    //           textInfo="Contributors who helped create the audio item."
    //           handleItemsUpdate={(data) => {
    //             this.setState({ createItemContributors: data })
    //           }}
    //         />

    //         {/* Recorders: fvm:recorder --------------- */}
    //         <FormRecorders
    //           className={this.props.groupName}
    //           // name="fvm:recorder"
    //           name=""
    //           textInfo="Recorders who helped create the audio item."
    //           handleItemsUpdate={(data) => {
    //             this.setState({ createItemRecorders: data })
    //           }}
    //         />

    //         {/* BTN: Create contributor ------------- */}
    //         <button
    //           disabled={isFetching || isSuccess}
    //           type="button"
    //           onClick={(event) => {
    //             event.preventDefault()
    //             this._handleCreateItemSubmit()
    //           }}
    //         >
    //           Create new audio item
    //         </button>

    //         {/* BTN: Cancel, go back ------------- */}
    //         <button
    //           disabled={isFetching || isSuccess}
    //           type="button"
    //           onClick={() => {
    //             this.setState({
    //               componentState: this.STATE_DEFAULT,
    //             })
    //           }}
    //         >
    //           {"Cancel, don't create new audio item"}
    //         </button>
    //         {formStatus}
    //       </div>
    //     )
    //     break
    //   }
    //   case this.STATE_CREATED: {
    //     // AUDIO CREATED/SELECTED ------------------------------------
    //     componentContent = (
    //       <div className="Form__sidebar">
    //         <div className="Form__main">
    //           <Preview id={id} type="FVAudio" />
    //         </div>
    //         <div className="FormItemButtons Form__aside">
    //           <FormRemoveButton
    //             id={id}
    //             textBtnRemoveItem={textBtnRemoveItem}
    //             handleClickRemoveItem={handleClickRemoveItem}
    //           />
    //           <FormMoveButtons
    //             id={id}
    //             idDescribedByItemMove={idDescribedByItemMove}
    //             textBtnMoveItemUp={textBtnMoveItemUp}
    //             textBtnMoveItemDown={textBtnMoveItemDown}
    //             handleClickMoveItemUp={handleClickMoveItemUp}
    //             handleClickMoveItemDown={handleClickMoveItemDown}
    //           />
    //         </div>
    //       </div>
    //     )
    //     break
    //   }
    //   default: {
    //     // INITIAL STATE ------------------------------------
    //     const { computeDialectFromParent, selectMediaComponent } = this.props
    //     const SelectMediaComponent = selectMediaComponent
    //     componentContent = (
    //       <div className="Form__sidebar">
    //         <div className="Form__main">
    //           {/* Create contributor */}
    //           <button
    //             type="button"
    //             onClick={() => {
    //               this._handleClickCreateItem()
    //             }}
    //           >
    //             {textBtnCreateItem}
    //           </button>

    //           <SelectMediaComponent
    //             type={'FVAudio'}
    //             label={textBtnSelectExistingItems}
    //             onComplete={_handleItemSelectedOrCreated}
    //             dialect={selectn('response', computeDialectFromParent)}
    //           />
    //         </div>
    //         <div className="FormItemButtons Form__aside">
    //           <FormRemoveButton
    //             id={id}
    //             textBtnRemoveItem={textBtnRemoveItem}
    //             handleClickRemoveItem={handleClickRemoveItem}
    //           />
    //         </div>
    //       </div>
    //     )
    //   }
    // }

    let content = <div>CreateAudio is misconfigured</div>
    switch (this.state.componentState) {
      case STATE_UNAVAILABLE: {
        content = this._stateGetUnavailable()
        break
      }

      case STATE_DEFAULT: {
        content = this._stateGetDefault()
        break
      }
      case STATE_ERROR: {
        content = this._stateGetError()
        break
      }
      case STATE_SUCCESS: {
        content = this._stateGetSuccess()
        break
      }
      default:
        content = <div>CreateAudio is misconfigured</div>
    }
    return content
  }
  _stateGetUnavailable = () => {
    const { className, groupName, textLegendItem } = this.props
    return (
      <Wrapper className={className} groupName={groupName} textLegendItem={textLegendItem}>
        <div>_stateGetUnavailable</div>
      </Wrapper>
    )
  }
  _stateGetDefault = () => {
    const { className, groupName, textLegendItem } = this.props
    const { index } = this.props
    //   isFetching || isSuccess
    const isInProgress = false
    // const isFetching = selectn('isFetching', computeCreate)
    const isFetching = false
    const formStatus = isFetching ? (
      <div className="alert alert-info">
        {intl.trans('views.components.editor.uploading_message', 'Uploading... Please be patient...', 'first')}
      </div>
    ) : null

    return (
      <Wrapper className={className} groupName={groupName} textLegendItem={textLegendItem}>
        <div>
          <h2>Create new audio item</h2>
          {/* Name ------------- */}
          <Text
            className={this.props.groupName}
            id={`${className}__Contributor${index}__NewName`}
            labelText="Name of audio item"
            // name={`${name}[${index}]__NewName`}
            name="FormRelatedAudioItem.name"
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
            // name="dc:description"
            name="FormRelatedAudioItem.description"
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
            // name="file"
            name=""
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
            // name="fvm:shared"
            name=""
            handleChange={(data) => {
              this.setState({ createItemIsShared: data })
            }}
          />
          {/* Child focused --------------- */}
          <Checkbox
            className={this.props.groupName}
            id="CreateAudio__ChildFocused"
            labelText="Audio is child focused"
            // name="fvm:child_focused"
            name=""
            handleChange={(data) => {
              this.setState({ createItemIsChildFocused: data })
            }}
          />

          {/* Contributors: fvm:source --------------- */}
          <FormContributors
            className={this.props.groupName}
            // name="fv:source"
            name=""
            textInfo="Contributors who helped create the audio item."
            handleItemsUpdate={(data) => {
              this.setState({ createItemContributors: data })
            }}
          />

          {/* Recorders: fvm:recorder --------------- */}
          <FormRecorders
            className={this.props.groupName}
            // name="fvm:recorder"
            name=""
            textInfo="Recorders who helped create the audio item."
            handleItemsUpdate={(data) => {
              this.setState({ createItemRecorders: data })
            }}
          />

          {/* BTN: Create contributor ------------- */}
          <button
            disabled={isInProgress}
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
            disabled={isInProgress}
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
      </Wrapper>
    )
  }
  _stateGetError = () => {
    const { className, groupName, textLegendItem } = this.props
    return (
      <Wrapper className={className} groupName={groupName} textLegendItem={textLegendItem}>
        <div>_stateGetError</div>
      </Wrapper>
    )
  }
  _stateGetSuccess = () => {
    const { className, groupName, textLegendItem } = this.props
    return (
      <Wrapper className={className} groupName={groupName} textLegendItem={textLegendItem}>
        <div>_stateGetSuccess</div>
      </Wrapper>
    )
  }

  _handleClickCreateItem = () => {
    console.log('!', '_handleClickCreateItem')
    // const { handleClickCreateItem } = this.props
    // this.setState(
    //   {
    //     componentState: this.STATE_CREATE,
    //   },
    //   () => {
    //     handleClickCreateItem()
    //   }
    // )
  }
  _handleSubmitExistingItem = (createItemUid) => {
    console.log('!', '_handleSubmitExistingItem')
    // this.setState(
    //   {
    //     componentState: this.STATE_CREATED,
    //     contributorUid: createItemUid,
    //   },
    //   () => {}
    // )
  }

  async _handleCreateItemSubmit() {
    console.log('!', '_handleCreateItemSubmit')
    // const {
    //   createItemName,
    //   createItemDescription,
    //   createItemFile,
    //   createItemIsShared,
    //   createItemIsChildFocused,
    //   createItemContributors,
    //   createItemRecorders,
    // } = this.state

    // const docParams = {
    //   type: 'FVAudio',
    //   name: createItemName,
    //   properties: {
    //     'dc:title': createItemName,
    //     'dc:description': createItemDescription,
    //     'fvm:shared': createItemIsShared,
    //     'fvm:child_focused': createItemIsChildFocused,
    //     'fvm:recorder': createItemRecorders['fvm:recorder'],
    //     'fvm:source': createItemContributors['fvm:source'],
    //   },
    // }

    // const timestamp = Date.now()
    // const { DIALECT_PATH } = this.props
    // this.props.createAudio(`${DIALECT_PATH}/Resources`, docParams, createItemFile, timestamp)
    // const pathOrId = `${DIALECT_PATH}/Resources/${createItemName}.${timestamp}`
    // this.setState({ pathOrId })
  }
}

export default provide(CreateAudio)
