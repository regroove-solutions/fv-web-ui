import React from 'react'
import { PropTypes } from 'react'
const { string } = PropTypes

import Text from './Text'
import Textarea from './Textarea'
import File from './File'
import Checkbox from './Checkbox'

export default class CreatePicture extends React.Component {
  static defaultProps = {
    className: 'CreatePicture',
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
      <form onSubmit={this.handleFormSubmit} className={`${className} CreatePicture`}>
        <h1>Create new picture (...)</h1>
        {/* Name --------------- */}
        <Text className="CreatePicture__Name" id="CreatePicture__Name" labelText="Name" name="dc:title" value="" />
        {/* Description --------------- */}
        <Textarea
          className="CreatePicture__Description"
          id="CreatePicture__Description"
          labelText="Description"
          name="dc:description"
          value=""
        />
        {/* Name --------------- */}
        <File className="CreatePicture__File" id="CreatePicture__File" labelText="File" name="file" value="" />
        {/* Shared --------------- */}
        <Checkbox
          className="CreatePicture__Shared"
          id="CreatePicture__Shared"
          labelText="Shared accross dialects?"
          name="fvm:shared"
        />
        {/* Child focused --------------- */}
        <Checkbox
          className="CreatePicture__ChildFocused"
          id="CreatePicture__ChildFocused"
          labelText="Child focused "
          name="fvm:child_focused"
        />

        {/* Contributors: fvm:source --------------- */}
        <fieldset>
          <legend>Contributors</legend>
          <p className="alert alert-info">Contributor(s) who helped create this picture.</p>
          <button type="button">Add Contributor</button>

          {/* Contributors > Contributor --------------- */}
          <fieldset>
            <legend>Contributor</legend>
            <input type="hidden" name="fv:source[0]" value="6b295938-1415-42e2-9b40-feb4663c3516" />
            <div>[Contributor HERE]</div>

            <button type="button">Edit Contributor</button>
            <button type="button">Remove Contributor</button>

            <button type="button" aria-describedby="describedByContributorMove">
              Move Contributor up
            </button>
            <button type="button" aria-describedby="describedByContributorMove">
              Move Contributor down
            </button>
          </fieldset>

          {/* Contributors > Contributor --------------- */}
          <fieldset>
            <legend>Contributor</legend>

            <Text
              className="Create__Contributor"
              id="CreateWord__Contributor0"
              labelText="Search existing Contributors"
              name="fv:source[1]"
              value=""
            />
            <button type="button">Create new Contributor</button>
            <button type="button" aria-describedby="describedbyContributorBrowse">
              Select from existing Contributors
            </button>
            <button type="button">Remove Contributor</button>

            <button type="button" aria-describedby="describedByContributorMove">
              Move Contributor up
            </button>
            <button type="button" aria-describedby="describedByContributorMove">
              Move Contributor down
            </button>
          </fieldset>

          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedbyContributorBrowse" className="visually-hidden">
            {'Select a Contributor from previously created Contributors'}
          </span>
          <span id="describedByContributorMove" className="visually-hidden">
            {`If you are adding multiple Contributors, you can change the position of the Contributor with
the 'Move Contributor up' and 'Move Contributor down' buttons`}
          </span>
        </fieldset>
        <button type="submit">Submit Picture</button>
      </form>
    )
  }

  handleFormSubmit = (event) => {
    event.preventDefault()
    // eslint-disable-next-line
    console.log('!', 'Submitted!')
  }
}
