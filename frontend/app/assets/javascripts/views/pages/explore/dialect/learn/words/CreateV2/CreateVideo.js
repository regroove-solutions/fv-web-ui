import React from 'react'
import { PropTypes } from 'react'
const { string } = PropTypes

import Text from './Text'
import Textarea from './Textarea'
import File from './File'
import Checkbox from './Checkbox'

export default class CreateVideo extends React.Component {
  static defaultProps = {
    className: 'CreateVideo',
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
      <form onSubmit={this.handleFormSubmit} className={`${className} CreateVideo`}>
        <h1>Create new video (...)</h1>
        {/* Name --------------- */}
        <Text className="CreateVideo__Name" id="CreateVideo__Name" labelText="Name" name="dc:title" value="" />
        {/* Description --------------- */}
        <Textarea
          className="CreateVideo__Description"
          id="CreateVideo__Description"
          labelText="Description"
          name="dc:description"
          value=""
        />
        {/* Name --------------- */}
        <File className="CreateVideo__File" id="CreateVideo__File" labelText="File" name="file" value="" />
        {/* Shared --------------- */}
        <Checkbox
          className="CreateVideo__Shared"
          id="CreateVideo__Shared"
          labelText="Shared accross dialects?"
          name="fvm:shared"
        />
        {/* Child focused --------------- */}
        <Checkbox
          className="CreateVideo__ChildFocused"
          id="CreateVideo__ChildFocused"
          labelText="Child focused "
          name="fvm:child_focused"
        />

        {/* Contributors: fvm:source --------------- */}
        <fieldset>
          <legend>Contributors</legend>
          <p className="alert alert-info">Contributor(s) who helped create this video.</p>
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
        <button type="submit">Submit Video</button>
      </form>
    )
  }

  handleFormSubmit = (event) => {
    event.preventDefault()
    // eslint-disable-next-line
    console.log('!', 'Submitted!')
  }
}
