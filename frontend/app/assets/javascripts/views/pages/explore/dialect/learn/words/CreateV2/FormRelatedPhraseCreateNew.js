import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
// import Textarea from './Textarea'
// import Select from './Select`'
// import File from './File'
import Checkbox from './Checkbox'
import FormContributors from './FormContributors'
// import FormRecorders from './FormRecorders'
import FormDefinitions from './FormDefinitions'
import FormCulturalNotes from './FormCulturalNotes'
import FormRelatedAudio from './FormRelatedAudio'
import FormRelatedPictures from './FormRelatedPictures'
import FormRelatedVideos from './FormRelatedVideos'
import ProviderHelpers from 'common/ProviderHelpers'
import IntlService from 'views/services/intl'

import Preview from 'views/components/Editor/Preview'
// see about dropping:
import selectn from 'selectn'
import provide from 'react-redux-provide'
const intl = IntlService.instance
const { func, object, number, string } = PropTypes
export class FormRelatedPhraseCreateNew extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATED = 2

  static propTypes = {
    name: string,
    className: string,
    groupName: string,
    id: number,
    textLegendItem: string,
    handleCancel: func,
    handleClickRemoveItem: func,
    handleItemSelected: func,
    componentState: number,

    DIALECT_PATH: string,

    // NOTE: COMING FROM REDUX/PROVIDER
    computeAudio: object.isRequired,
    createAudio: func.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedPhraseCreateNew',
    groupName: 'Form__group',
    id: undefined,
    componentState: 0,
    handleCancel: () => {},
    handleClickRemoveItem: () => {},
    handleItemSelected: () => {},
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

  render() {
    const { className, id, textLegendItem, handleClickRemoveItem } = this.props

    let componentContent = null
    const computeCreate = ProviderHelpers.getEntry(this.props.computeAudio, this.state.pathOrId)
    const isFetching = selectn('isFetching', computeCreate)
    const isSuccess = selectn('success', computeCreate)

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
      case this.STATE_CREATED: {
        // AUDIO CREATED/SELECTED ------------------------------------
        const previewInput = (
          <div>
            <Preview id={id} type="FVAudio" />
          </div>
        )

        componentContent = <div>{previewInput}</div>
        break
      }
      default: {
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
            <h2>Create new Related Phrase</h2>
            {/* Name ------------- */}
            <Text
              className={this.props.groupName}
              id=".phrase"
              labelText="Phrase"
              name="FormRelatedPhraseCreateNew.name"
              value=""
              //   handleChange={(data) => {
              //     this.setState({ createItemName: data })
              //   }}
            />

            {/* Definitions --------------- */}
            <FormDefinitions className="Form__group" name="fv:definitions" />

            <div>-- Phrase Books: x --</div>

            {/* RELATED AUDIO --------------- */}
            <FormRelatedAudio className="Form__group" name="fv:related_audio" />

            {/* RELATED PICTURES --------------- */}
            <FormRelatedPictures className="Form__group" name="fv:related_pictures" />

            {/* RELATED VIDEOS --------------- */}
            <FormRelatedVideos className="Form__group" name="fv:related_pictures" />

            {/* Cultural Notes --------------- */}
            <FormCulturalNotes className="Form__group" name="fv:cultural_note" />

            {/* REFERENCE --------------- */}
            <div className="Form__group">
              <Text
                className=""
                id="CreateWord__Reference1"
                labelText="Reference"
                name="fv:reference"
                ariaDescribedby="describedByReference"
                value=""
              />
              <span id="describedByReference">Origin of record (person, book, etc).</span>
            </div>

            <div>-- Source: x --</div>
            {/* Contributors --------------- */}
            <FormContributors
              className="Form__group"
              textInfo="Contributors who helped create this record."
              name="fv:source"
            />

            {/* IN CHILDREN'S ARCHIVE --------------- */}
            <Checkbox
              className="Form__group"
              id="CreateWord__InKidsArchive0"
              labelText="Available in children's archive"
              name="fv:available_in_childrens_archive"
            />

            {/* BTN: Create contributor ------------- */}
            <button
              disabled={isFetching || isSuccess}
              type="button"
              onClick={() => {
                this._handleCreateItemSubmit()
              }}
            >
              Create new audio item
            </button>

            {/* BTN: Cancel, go back ------------- */}
            <button
              disabled={isFetching || isSuccess}
              type="button"
              onClick={() => {
                this.props.handleCancel()
              }}
            >
              {"Cancel, don't create Related Phrase"}
            </button>
            {formStatus}
          </div>
        )
      }
    }
    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>{textLegendItem}</legend>
        {componentContent}
      </fieldset>
    )
  }

  async _handleCreateItemSubmit() {
    console.log('Validate using yup') // eslint-disable-line
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

export default provide(FormRelatedPhraseCreateNew)
