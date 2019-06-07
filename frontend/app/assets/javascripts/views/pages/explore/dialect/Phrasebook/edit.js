import React from 'react'
import { PropTypes } from 'react'
import ProviderHelpers from 'common/ProviderHelpers'
import StateUnavailable from './states/unavailable'
import StateSuccessEdit from './states/successEdit'
import StateSuccessDelete from './states/successDelete'
import StateEdit from './states/create'
import StateErrorBoundary from './states/errorBoundary'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  createCategory,
  deleteCategory,
  fetchCategory,
  fetchCategorys,
  updateCategory,
} from 'providers/redux/reducers/fvCategory'
import { fetchDialect, fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import { getFormData, handleSubmit } from 'common/FormHelpers'

// Models
import { Document } from 'nuxeo'

import {
  STATE_UNAVAILABLE,
  STATE_DEFAULT,
  STATE_ERROR,
  STATE_SUCCESS,
  STATE_SUCCESS_DELETE,
  STATE_ERROR_BOUNDARY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_LANGUAGE,
  DEFAULT_SORT_COL,
  DEFAULT_SORT_TYPE,
} from 'common/Constants'

import '!style-loader!css-loader!./Phrasebook.css'

const { array, element, func, number, object, string } = PropTypes

export class PhrasebookEdit extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    groupName: string,
    breadcrumb: element,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    onDocumentCreated: func,
    validator: object,
    createUrl: string,
    // REDUX: reducers/state
    computeCategory: object.isRequired,
    computeCategorys: object.isRequired,
    computeCreateCategory: object,
    computeDialect: object.isRequired,
    computeDialect2: object.isRequired,
    routeParams: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    createCategory: func.isRequired,
    deleteCategory: func.isRequired,
    fetchCategory: func.isRequired,
    fetchCategorys: func.isRequired,
    fetchDialect: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    updateCategory: func.isRequired,
  }
  static defaultProps = {
    className: 'FormPhrasebook',
    groupName: '',
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
    const copy = this.props.copy
      ? this.props.copy
      : await import(/* webpackChunkName: "PhrasebookInternationalization" */ './internationalization').then(
          (_copy) => {
            return _copy.default
          }
        )

    const validator = this.props.validator
      ? this.props.validator
      : await import(/* webpackChunkName: "PhrasebookValidator" */ './validator').then((_validator) => {
          return _validator.default
        })
    await this._getData({ copy, validator })
  }
  render() {
    let content = null
    switch (this.state.componentState) {
      case STATE_DEFAULT: {
        content = this._stateGetEdit()
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
      case STATE_SUCCESS_DELETE: {
        content = this._stateGetSuccessDelete()
        break
      }
      case STATE_ERROR_BOUNDARY: {
        // STATE_ERROR_BOUNDARY === server or authentication issue
        content = this._stateGetErrorBoundary()
        break
      }
      default:
        // STATE_UNAVAILABLE === loading
        content = this._stateGetUnavailable()
    }
    return content
  }
  _getData = async (addToState = {}) => {
    // Do any loading here...
    const { routeParams } = this.props
    const { itemId } = routeParams

    await this.props.fetchCategory(itemId)
    const contributor = await this._getCategory()

    if (contributor.isError) {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
        errorMessage: contributor.message,
        ...addToState,
      })
    } else {
      this.setState({
        errorMessage: undefined,
        componentState: STATE_DEFAULT,
        valueName: contributor.name,
        valueDescription: contributor.description,
        contributor: contributor.data,
        ...this._commonInitialState,
        ...addToState,
      })
    }
  }
  _stateGetUnavailable = () => {
    const { className } = this.props
    return <StateUnavailable className={className} isEdit copy={this.state.copy} />
  }
  _stateGetErrorBoundary = () => {
    // Make `errorBoundary.explanation` === `errorBoundary.explanationEdit`
    const _copy = Object.assign({}, this.state.copy)
    _copy.errorBoundary.explanation = this.state.copy.errorBoundary.explanationEdit
    return <StateErrorBoundary errorMessage={this.state.errorMessage} copy={this.state.copy} />
  }
  _stateGetEdit = () => {
    const { className, breadcrumb, groupName } = this.props
    const { errors, isBusy, valueDescription, valueName, valuePhotoName, valuePhotoData } = this.state
    return (
      <StateEdit
        copy={this.state.copy}
        className={className}
        groupName={groupName}
        breadcrumb={breadcrumb}
        errors={errors}
        isBusy={isBusy}
        isEdit
        deleteSelf={() => {
          // this.props.deleteCategory(this.state.contributor.id)
          this.setState({
            componentState: STATE_SUCCESS_DELETE,
          })
        }}
        onRequestSaveForm={() => {
          this._onRequestSaveForm()
        }}
        setFormRef={this.setFormRef}
        valueName={valueName}
        valueDescription={valueDescription}
        valuePhotoName={valuePhotoName}
        valuePhotoData={valuePhotoData}
      />
    )
  }
  _stateGetError = () => {
    // default state handles errors, just call it...
    return this._stateGetEdit()
  }
  _stateGetSuccess = () => {
    const { className } = this.props
    const { formData, itemUid } = this.state

    return (
      <StateSuccessEdit
        className={className}
        copy={this.state.copy}
        itemUid={itemUid}
        formData={formData}
        handleClick={() => {
          this._getData()
        }}
      />
    )
  }
  _stateGetSuccessDelete = () => {
    const { createUrl, className, routeParams } = this.props
    const { formData } = this.state
    const { theme, dialect_path } = routeParams
    const _createUrl = createUrl || `/${theme}${dialect_path}/create/contributor`
    return (
      <StateSuccessDelete createUrl={_createUrl} className={className} copy={this.state.copy} formData={formData} />
    )
  }
  async _handleCreateItemSubmit(formData) {
    const { contributor } = this.state

    const newDocument = new Document(contributor.response, {
      repository: contributor.response._repository,
      nuxeo: contributor.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set({
      'dc:description': formData['dc:description'],
      'dc:title': formData['dc:title'],
    })

    // Save document
    const _updateCategory = await this.props.updateCategory(newDocument, null, null)

    if (_updateCategory.success) {
      this.setState({
        errors: [],
        formData,
        itemUid: _updateCategory.pathOrId,
        componentState: STATE_SUCCESS,
      })
    } else {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
        errorMessage: _updateCategory.message,
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
      validator: this.state.validator,
      formData,
      valid,
      invalid,
    })
  }
  _getCategory = async () => {
    const { computeCategory, routeParams } = this.props
    const { itemId } = routeParams
    // Extract data from immutable:
    const _computeCategory = await ProviderHelpers.getEntry(computeCategory, itemId)
    if (_computeCategory.success) {
      // Extract data from object:
      const name = selectn(['response', 'properties', 'dc:title'], _computeCategory)
      const description = selectn(['response', 'properties', 'dc:description'], _computeCategory)

      // Respond...
      return {
        isError: _computeCategory.isError,
        name,
        description,
        data: _computeCategory,
      }
    }
    return { isError: _computeCategory.isError, message: _computeCategory.message }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCategory, fvDialect, navigation, windowPath } = state

  const { computeCategory, computeCategorys, computeCreateCategory } = fvCategory
  const { computeDialect, computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { route } = navigation

  return {
    computeCategory,
    computeCategorys,
    computeCreateCategory,
    computeDialect,
    computeDialect2,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createCategory,
  deleteCategory,
  fetchCategory,
  fetchCategorys,
  fetchDialect,
  fetchDialect2,
  pushWindowPath,
  updateCategory,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhrasebookEdit)
