import React from 'react'
import { PropTypes } from 'react'
import Text from 'views/components/Form/Common/Text'
import Textarea from 'views/components/Form/Common/Textarea'
import StringHelpers from 'common/StringHelpers'

import provide from 'react-redux-provide'

import { getError, getErrorFeedback, getFormData, handleSubmit } from 'common/FormHelpers'
import validator from './validation'

import copy from './internationalization'

import { STATE_UNAVAILABLE, STATE_DEFAULT, STATE_ERROR, STATE_SUCCESS, STATE_ERROR_BOUNDARY } from 'common/Constants'
const { element, string, func } = PropTypes

export class CreateRecorder extends React.Component {
  static propTypes = {
    className: string,
    groupName: string,
    breadcrumb: element,
    // Provide
    pushWindowPath: func.isRequired,
  }
  static defaultProps = {
    className: 'FormRecorder',
    groupName: 'Form__group',
    breadcrumb: null,
  }
  state = {
    componentState: STATE_UNAVAILABLE,
    errors: [],
    formData: {},
  }
  // NOTE: Using callback refs since on old React
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
  form = null
  setFormRef = (_element) => {
    this.form = _element
  }

  componentDidMount() {
    // Do any loading here...
    // Flip to ready state...
    this.setState({
      componentState: STATE_DEFAULT,
    })
  }

  render() {
    let content = null
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
      case STATE_ERROR_BOUNDARY: {
        content = this._stateGetErrorBoundary()
        break
      }
      default:
        content = <div>{/* Shouldn't get here */}</div>
    }
    return content
  }

  _stateGetUnavailable = () => {
    const { className } = this.props
    return <div className={className}>{copy.loading}</div>
  }
  _stateGetErrorBoundary = () => {
    return (
      <div>
        <h1>{copy.errorBoundary.title}</h1>
        <p>{copy.errorBoundary.explanation}</p>
        <p>{copy.errorBoundary.optimism}</p>
      </div>
    )
  }
  _stateGetDefault = () => {
    const { className, breadcrumb } = this.props
    const { errors } = this.state

    //   isFetching || isSuccess
    const isInProgress = false
    // // const isFetching = selectn('isFetching', computeCreate)
    // const isFetching = false
    // const formStatus = isFetching ? <div className="alert alert-info">{'Uploading... Please be patient...'}</div> : null
    return (
      <form
        className={className}
        ref={this.setFormRef}
        onSubmit={(e) => {
          e.preventDefault()
          this._onRequestSaveForm()
        }}
      >
        {breadcrumb}
        <h2>{copy.title}</h2>

        {/* Name ------------- */}
        <Text
          className={this.props.groupName}
          id={this._clean('dc:title')}
          name="dc:title"
          value=""
          error={getError({ errors, fieldName: 'dc:title' })}
          labelText={copy.name}
        />

        {/* Description ------------- */}
        <Textarea
          className={this.props.groupName}
          id={this._clean('dc:description')}
          labelText={copy.description}
          name="dc:description"
          value=""
          error={getError({ errors, fieldName: 'dc:description' })}
        />

        {/* {formStatus} */}
        {getErrorFeedback({ errors })}

        {/* BTN: Create contributor ------------- */}
        <button disabled={isInProgress} type="submit">
          {copy.submit}
        </button>
      </form>
    )
  }
  _stateGetError = () => {
    return this._stateGetDefault()
  }
  _stateGetSuccess = () => {
    const { className } = this.props
    const { formData } = this.state

    const name = formData['dc:title']
    const description = formData['dc:description']
    return (
      <div className={className}>
        <h1>{copy.success.title}</h1>
        <p>{copy.success.review}</p>
        <dl>
          <dt>{name || copy.success.noName}</dt>
          <dd>{description || ''}</dd>
        </dl>
        <p>{copy.success.thanks}</p>
        <a
          href={window.location.pathname}
          onClick={(e) => {
            e.preventDefault()
            this.setState({
              errors: [],
              formData: {},
              componentState: STATE_DEFAULT,
            })
          }}
        >
          {copy.success.createAnother}
        </a>
      </div>
    )
  }
  _clean = (name) => {
    return StringHelpers.clean(name, 'CLEAN_ID')
  }
  async _handleCreateItemSubmit(formData) {
    // Submit here
    this.setState({
      errors: [],
      formData,
      componentState: STATE_SUCCESS,
    })
  }
  _onRequestSaveForm = async () => {
    const formData = getFormData({
      formReference: this.form,
    })
    const success = () => {
      this._handleCreateItemSubmit(formData)
    }
    const failure = (response) => {
      this.setState({
        errors: response.errors,
        componentState: STATE_ERROR,
      })
    }

    handleSubmit({
      validator,
      formData,
      success,
      failure,
    })
  }
}

export default provide(CreateRecorder)
