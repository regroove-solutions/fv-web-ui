import React from 'react'
import { PropTypes } from 'react'
const { string } = PropTypes

import Text from './Text'
import Textarea from './Textarea'
import File from './File'
import Checkbox from './Checkbox'
import FormContributors from './FormContributors'

export default class CreateAudio extends React.Component {
  static defaultProps = {
    className: 'CreateAudio',
    value: '',
  }

  static propTypes = {
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    ariaDescribedby: string,
    className: string,
    value: string,
  }

  state = {
    value: this.props.value,
  }

  render() {
    const { className } = this.props
    return (
      <form onSubmit={this.handleFormSubmit} className={`${className} CreateAudio`}>
        <h1>Create new audio (...)</h1>
        {/* Name --------------- */}
        <Text className="CreateAudio__Name" id="CreateAudio__Name" labelText="Name" name="dc:title" value="" />
        {/* Description --------------- */}
        <Textarea
          className="CreateAudio__Description"
          id="CreateAudio__Description"
          labelText="Description"
          name="dc:description"
          value=""
        />
        {/* Name --------------- */}
        <File className="CreateAudio__File" id="CreateAudio__File" labelText="File" name="file" value="" />
        {/* Shared --------------- */}
        <Checkbox
          className="CreateAudio__Shared"
          id="CreateAudio__Shared"
          labelText="Shared accross dialects?"
          name="fvm:shared"
        />
        {/* Child focused --------------- */}
        <Checkbox
          className="CreateAudio__ChildFocused"
          id="CreateAudio__ChildFocused"
          labelText="Child focused "
          name="fvm:child_focused"
        />

        {/* Contributors: fvm:source --------------- */}
        <FormContributors
          name="fv:source"
          textInfo="Contributors who helped create this audio."
          // textInfo="textInfo"
          // textDescribedbyContributorBrowse="textDescribedbyContributorBrowse"
          // textDescribedByContributorMove="textDescribedByContributorMove"
          // textLegendContributors="textLegendContributors"
          // textBtnAddContributor="textBtnAddContributor"
          // textLegendContributor="textLegendContributor"
          // textBtnEditContributor="textBtnEditContributor"
          // textBtnRemoveContributor="textBtnRemoveContributor"
          // textBtnMoveContributorUp="textBtnMoveContributorUp"
          // textBtnMoveContributorDown="textBtnMoveContributorDown"
          // textBtnCreateContributor="textBtnCreateContributor"
          // textBtnSelectExistingContributors="textBtnSelectExistingContributors"
          // textLabelContributorSearch="textLabelContributorSearch"
        />

        {/* Recorders: fvm:recorder --------------- */}
        <fieldset>
          <legend>Recorders</legend>
          <p className="alert alert-info">Recorders who helped create this audio.</p>
          <button type="button">Add Recorder</button>

          {/* Recorders > Recorder --------------- */}
          <fieldset>
            <legend>Recorder</legend>
            <input type="hidden" name="fv:source[0]" value="6b295938-1415-42e2-9b40-feb4663c3516" />
            <div>[Recorder HERE]</div>

            <button type="button">Edit Recorder</button>
            <button type="button">Remove Recorder</button>

            <button type="button" aria-describedby="describedByRecorderMove">
              Move Recorder up
            </button>
            <button type="button" aria-describedby="describedByRecorderMove">
              Move Recorder down
            </button>
          </fieldset>

          {/* Recorders > Recorder --------------- */}
          <fieldset>
            <legend>Recorder</legend>

            <Text
              className="Create__Recorder"
              id="CreateWord__Recorder0"
              labelText="Search existing Recorders"
              name="fv:source[1]"
              value=""
            />
            <button type="button">Create new Recorder</button>
            <button type="button" aria-describedby="describedbyRecorderBrowse">
              Select from existing Recorders
            </button>
            <button type="button">Remove Recorder</button>

            <button type="button" aria-describedby="describedByRecorderMove">
              Move Recorder up
            </button>
            <button type="button" aria-describedby="describedByRecorderMove">
              Move Recorder down
            </button>
          </fieldset>

          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedbyRecorderBrowse" className="visually-hidden">
            {'Select a Recorder from previously created Recorders'}
          </span>
          <span id="describedByRecorderMove" className="visually-hidden">
            {`If you are adding multiple Recorders, you can change the position of the Recorder with
the 'Move Recorder up' and 'Move Recorder down' buttons`}
          </span>
        </fieldset>
        <button type="submit">Submit Audio</button>
      </form>
    )
  }

  handleFormSubmit = (event) => {
    event.preventDefault()
    // eslint-disable-next-line
    console.log('!', 'Submitted!')
  }
}
