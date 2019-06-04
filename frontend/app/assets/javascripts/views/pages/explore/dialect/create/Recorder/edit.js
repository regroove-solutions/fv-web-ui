import React from 'react'
import { PropTypes } from 'react'
import ProviderHelpers from 'common/ProviderHelpers'
import RecorderStatesUnavailable from './states/unavailable'
import RecorderStatesSuccessEdit from './states/successEdit'
import RecorderStatesDefault from './states/default'
import RecorderStatesErrorBoundary from './states/errorBoundary'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  createContributor,
  fetchContributor,
  fetchContributors,
  updateContributor,
} from 'providers/redux/reducers/fvContributor'
import { fetchDialect, fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import { getFormData, handleSubmit } from 'common/FormHelpers'
import validator from './validation'
// Models
import { Document } from 'nuxeo'

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
import copy from './internationalization'
const { array, element, func, number, object, string } = PropTypes

export class EditRecorder extends React.Component {
  static propTypes = {
    className: string,
    groupName: string,
    breadcrumb: element,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    onDocumentCreated: func,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeContributor: object.isRequired,
    computeContributors: object.isRequired,
    computeCreateContributor: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createContributor: func.isRequired,
    fetchContributor: func.isRequired,
    fetchContributors: func.isRequired,
    fetchDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    updateContributor: func.isRequired,
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
    await this._getData()
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
  _getData = async() => {
    // Do any loading here...
    // console.log('! componentDidMount')
    const { routeParams } = this.props
    const { contributorId } = routeParams
    await this.props.fetchContributor(contributorId)
    const recorder = await this._getRecorder()
    this.setState({
      componentState: STATE_DEFAULT,
      valueName: recorder.valueName,
      valueDescription: recorder.valueDescription,
      recorder: recorder.data,
      ...this._commonInitialState,
    })
  }
  _stateGetUnavailable = () => {
    const { className } = this.props
    return <RecorderStatesUnavailable className={className} />
  }
  _stateGetErrorBoundary = () => {
    return <RecorderStatesErrorBoundary />
  }
  _stateGetDefault = () => {
    const { className, breadcrumb, groupName } = this.props
    const { errors, isBusy, valueDescription, valueName } = this.state
    return (
      <RecorderStatesDefault
        copyTitle={copy.edit.title}
        copySubmit={copy.edit.submit}
        className={className}
        groupName={groupName}
        breadcrumb={breadcrumb}
        errors={errors}
        isBusy={isBusy}
        onRequestSaveForm={() => {
          this._onRequestSaveForm()
        }}
        setFormRef={this.setFormRef}
        valueName={valueName}
        valueDescription={valueDescription}
      />
    )
  }
  _stateGetError = () => {
    // default state handles errors, just call it...
    return this._stateGetDefault()
  }
  _stateGetSuccess = () => {
    const { className } = this.props
    const { formData } = this.state

    return (
      <RecorderStatesSuccessEdit
        className={className}
        formData={formData}
        handleClick={() => {
          // this.setState({
          //   componentState: STATE_DEFAULT,
          //   ...this._commonInitialState,
          // })
          this._getData()
        }}
      />
    )
  }
  async _handleCreateItemSubmit(formData) {
    const { recorder } = this.state

    const newDocument = new Document(recorder.response, {
      repository: recorder.response._repository,
      nuxeo: recorder.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set(formData)

    // Save document
    const _updateContributor = await this.props.updateContributor(newDocument, null, null)
    if (_updateContributor.success) {
      this.setState({
        errors: [],
        formData,
        // itemUid: response.uid,
        componentState: STATE_SUCCESS,
      })
    } else {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
      })
    }

    // if (onDocumentCreated) {
    //   const _onDocumentCreated = await onDocumentCreated(newDocument)
    // }

    // this.setState({ formValue: formValue })

    // // Submit here
    // const now = Date.now()
    // const name = formData['dc:title']
    // const results = await this.props.createContributor(
    //   `${this.DIALECT_PATH}/Contributors`,
    //   {
    //     type: 'FVContributor',
    //     name: name,
    //     properties: formData,
    //   },
    //   null,
    //   now
    // )
    // if (results.success === false) {
    //   this.setState({
    //     componentState: STATE_ERROR_BOUNDARY,
    //   })
    //   return
    // }

    // const item = ProviderHelpers.getEntry(
    //   this.props.computeContributor,
    //   `${this.DIALECT_PATH}/Contributors/${name}.${now}`
    // )
    // const response = item.response || {}

    // if (response && response.uid) {
    //   this.setState({
    //     errors: [],
    //     formData,
    //     itemUid: response.uid,
    //     componentState: STATE_SUCCESS,
    //   })
    // } else {
    //   this.setState({
    //     componentState: STATE_ERROR_BOUNDARY,
    //   })
    // }
  }
  _onRequestSaveForm = async() => {
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
  _getRecorder = async() => {
    const { computeContributor, routeParams } = this.props
    const { contributorId } = routeParams
    // Extract data from immutable:
    const _computeContributor = await ProviderHelpers.getEntry(computeContributor, contributorId)
    if (_computeContributor.success) {
      // Extract data from object:
      const valueName = selectn(['response', 'properties', 'dc:title'], _computeContributor)
      const valueDescription = selectn(['response', 'properties', 'dc:description'], _computeContributor)
      return { valueName, valueDescription, data: _computeContributor }
    }
    this._getRecorder()
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvContributor, fvDialect, windowPath } = state

  const { computeContributor, computeContributors, computeCreateContributor } = fvContributor
  const { computeDialect, computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath

  return {
    computeContributor,
    computeContributors,
    computeCreateContributor,
    computeDialect,
    computeDialect2,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createContributor,
  fetchContributor,
  fetchContributors,
  fetchDialect,
  fetchDialect2,
  pushWindowPath,
  updateContributor,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditRecorder)
