import React from 'react'
import { PropTypes } from 'react'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchContributor, fetchContributors } from 'providers/redux/reducers/fvContributor'

import ProviderHelpers from 'common/ProviderHelpers'

import { STATE_UNAVAILABLE, STATE_DEFAULT, STATE_ERROR_BOUNDARY } from 'common/Constants'

import StateUnavailable from './states/unavailable'
import StateDetail from './states/detail'
import StateErrorBoundary from './states/errorBoundary'

import '!style-loader!css-loader!./Phrasebook.css'

const { element, func, number, object, string } = PropTypes

export class PhrasebookDetail extends React.Component {
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
    // REDUX: reducers/state
    computeContributor: object.isRequired,
    routeParams: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchContributor: func.isRequired,
    fetchContributors: func.isRequired,
  }
  static defaultProps = {
    className: 'Contributor',
  }

  state = {
    componentState: STATE_UNAVAILABLE,
  }
  async componentDidMount() {
    const copy = this.props.copy
      ? this.props.copy
      : await import(/* webpackChunkName: "ContributorDetailsInternationalization" */ './internationalization').then(
          (_copy) => {
            return _copy.default
          }
        )

    await this._getData({ copy })
  }
  render() {
    let content = null
    switch (this.state.componentState) {
      case STATE_UNAVAILABLE: {
        content = this._stateGetUnavailable()
        break
      }

      case STATE_DEFAULT: {
        content = this._stateGetDetail()
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
  _getData = async (addToState = {}) => {
    // Do any loading here...
    const { routeParams } = this.props
    const { itemId } = routeParams
    await this.props.fetchContributor(itemId)
    const contributor = await this._getContributor()

    if (contributor.isError) {
      this.setState({
        componentState: STATE_ERROR_BOUNDARY,
        errorMessage: contributor.message,
        ...addToState,
      })
    } else {
      this.setState({
        componentState: STATE_DEFAULT,
        valueName: contributor.name,
        valueDescription: contributor.description,
        valuePhotoName: contributor.photoName,
        valuePhotoData: contributor.photoData,
        contributor: contributor.data,
        ...addToState,
      })
    }
  }
  _stateGetUnavailable = () => {
    const { className } = this.props
    return <StateUnavailable className={className} copy={this.state.copy} />
  }
  _stateGetErrorBoundary = () => {
    return <StateErrorBoundary errorMessage={this.state.errorMessage} copy={this.state.copy} />
  }
  _stateGetDetail = () => {
    const { className, groupName } = this.props
    const { isBusy, valueDescription, valueName, valuePhotoName, valuePhotoData } = this.state
    return (
      <StateDetail
        copy={this.state.copy}
        className={className}
        groupName={groupName}
        isBusy={isBusy}
        valueName={valueName}
        valueDescription={valueDescription}
        valuePhotoName={valuePhotoName}
        valuePhotoData={valuePhotoData}
      />
    )
  }
  _getContributor = async () => {
    const { computeContributor, routeParams } = this.props
    const { itemId } = routeParams
    // Extract data from immutable:
    const _computeContributor = await ProviderHelpers.getEntry(computeContributor, itemId)
    if (_computeContributor.success) {
      // Extract data from object:
      const name = selectn(['response', 'properties', 'dc:title'], _computeContributor)
      const description = selectn(['response', 'properties', 'dc:description'], _computeContributor)
      const photoName = selectn(
        ['response', 'properties', 'fvcontributor:profile_picture', 'name'],
        _computeContributor
      )
      const photoData = selectn(
        ['response', 'properties', 'fvcontributor:profile_picture', 'data'],
        _computeContributor
      )

      // Respond...
      return { name, description, photoName, photoData, data: _computeContributor }
    }
    return { isError: _computeContributor.isError, message: _computeContributor.message }
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvContributor, navigation } = state

  const { computeContributor } = fvContributor

  const { route } = navigation

  return {
    computeContributor,
    routeParams: route.routeParams,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchContributor,
  fetchContributors,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhrasebookDetail)
