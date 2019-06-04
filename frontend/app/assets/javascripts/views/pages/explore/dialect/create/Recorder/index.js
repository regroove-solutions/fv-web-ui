import React from 'react'
import { PropTypes } from 'react'
import ProviderHelpers from 'common/ProviderHelpers'
import RecorderStatesUnavailable from './states/unavailable'
import RecorderStatesSuccessDefault from './states/successDefault'
import RecorderStatesDefault from './states/default'
import RecorderStatesErrorBoundary from './states/errorBoundary'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { createContributor, fetchContributors } from 'providers/redux/reducers/fvContributor'
import { fetchDialect } from 'providers/redux/reducers/fvDialect'

import { getFormData, handleSubmit } from 'common/FormHelpers'
import validator from './validation'

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
    // REDUX: reducers/state
    computeContributor: object.isRequired,
    computeContributors: object.isRequired,
    computeCreateContributor: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createContributor: func.isRequired,
    fetchContributors: func.isRequired,
    fetchDialect: func.isRequired,
    pushWindowPath: func.isRequired,
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
    const { computeDialect } = this.props

    // USING this.DIALECT_PATH instead of setting state
    // this.setState({ dialectPath: dialectPath })
    this.DIALECT_PATH = ProviderHelpers.getDialectPathFromURLArray(this.props.splitWindowPath)
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
    // return <Provider store={store}>{content}</Provider>
    return content
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
    const { errors, isBusy } = this.state
    //   isFetching || isSuccess
    // const isInProgress = false
    // // const isFetching = selectn('isFetching', computeCreate)
    // const isFetching = false
    // const formStatus = isFetching ? <div className="alert alert-info">{'Uploading... Please be patient...'}</div> : null
    return (
      <RecorderStatesDefault
        className={className}
        groupName={groupName}
        breadcrumb={breadcrumb}
        errors={errors}
        isBusy={isBusy}
        onRequestSaveForm={() => {
          this._onRequestSaveForm()
        }}
        setFormRef={this.setFormRef}
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
      <RecorderStatesSuccessDefault
        className={className}
        formData={formData}
        handleClick={() => {
          this.setState({
            componentState: STATE_DEFAULT,
            ...this._commonInitialState,
          })
        }}
      />
    )
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
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvContributor, windowPath } = state

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
  fetchContributors,
  fetchDialect,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateRecorder)
