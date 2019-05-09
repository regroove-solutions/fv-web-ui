import React from 'react'
import { PropTypes } from 'react'
import Text from 'views/components/Form/Common/Text'
import Textarea from 'views/components/Form/Common/Textarea'
import StringHelpers from 'common/StringHelpers'
import ProviderHelpers from 'common/ProviderHelpers'

import provide from 'react-redux-provide'

import { getError, getErrorFeedback, getFormData, handleSubmit } from 'common/FormHelpers'
import validator from './validation'

import copy from './internationalization'

import {
  STATE_UNAVAILABLE,
  STATE_DEFAULT,
  STATE_ERROR,
  STATE_SUCCESS,
  STATE_ERROR_BOUNDARY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_LANGUAGE,
  DEFAULT_SORT_COL,
  DEFAULT_SORT_TYPE,
} from 'common/Constants'
const { array, element, func, number, object, string } = PropTypes

export class CreateRecorder extends React.Component {
  static propTypes = {
    className: string,
    groupName: string,
    breadcrumb: element,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    // Provider
    pushWindowPath: func.isRequired,
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
    className: 'FormRecorder',
    groupName: 'Form__group',
    breadcrumb: null,
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    DEFAULT_LANGUAGE,
    DEFAULT_SORT_COL,
    DEFAULT_SORT_TYPE,
  }

  _commonInitialState = {
    errors: [],
    formData: {},
    isBusy: false,
  }
  state = {
    componentState: STATE_UNAVAILABLE,
    ...this._commonInitialState,
  }
  // NOTE: Using callback refs since on old React
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
  form = null
  setFormRef = (_element) => {
    this.form = _element
  }

  async componentDidMount() {
    // Do any loading here...
    const { computeDialect, splitWindowPath } = this.props

    // USING this.DIALECT_PATH instead of setting state
    // this.setState({ dialectPath: dialectPath })
    this.DIALECT_PATH = ProviderHelpers.getDialectPathFromURLArray(splitWindowPath)
    this.CONTRIBUTOR_PATH = `${this.DIALECT_PATH}/Contributors`
    // Get data for computeDialect
    if (!computeDialect.success) {
      await this.props.fetchDialect('/' + this.DIALECT_PATH)
    }

    let currentAppliedFilter = '' // eslint-disable-line
    // if (filter.has('currentAppliedFilter')) {
    //   currentAppliedFilter = Object.values(filter.get('currentAppliedFilter').toJS()).join('')
    // }
    await this.props.fetchContributors(
      this.CONTRIBUTOR_PATH,
      `${currentAppliedFilter}&currentPageIndex=${this.props.DEFAULT_PAGE - 1}&pageSize=${
        this.props.DEFAULT_PAGE_SIZE
      }&sortOrder=${this.props.DEFAULT_SORT_TYPE}&sortBy=${this.props.DEFAULT_SORT_COL}`
    )
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
    const { errors, isBusy } = this.state

    //   isFetching || isSuccess
    // const isInProgress = false
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
        <button disabled={isBusy} type="submit">
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
              componentState: STATE_DEFAULT,
              ...this._commonInitialState,
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
    const now = Date.now()
    const name = formData['dc:title']
    const results = await this.props.createContributor(
      `${this.DIALECT_PATH}/Contributors`,
      {
        type: 'FVContributor',
        name: name,
        properties: formData,
      },
      null,
      now
    )
    if (results.success === false) {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
      })
      return
    }

    const item = ProviderHelpers.getEntry(
      this.props.computeContributor,
      `${this.DIALECT_PATH}/Contributors/${name}.${now}`
    )
    const response = item.response || {}

    if (response && response.uid) {
      this.setState({
        errors: [],
        formData,
        itemUid: response.uid,
        componentState: STATE_SUCCESS,
      })
    } else {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
      })
    }
  }
  _onRequestSaveForm = async () => {
    const formData = getFormData({
      formReference: this.form,
    })
    const valid = () => {
      this.setState(
        {
          isBusy: true,
        },
        () => {
          this._handleCreateItemSubmit(formData)
        }
      )
    }
    const invalid = (response) => {
      this.setState({
        errors: response.errors,
        componentState: STATE_ERROR,
      })
    }

    handleSubmit({
      validator,
      formData,
      valid,
      invalid,
    })
  }
}

export default provide(CreateRecorder)
