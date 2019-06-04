/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component, PropTypes } from 'react'
import ConfGlobal from 'conf/local.js'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchPortals } from 'providers/redux/reducers/fvPortal'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import classNames from 'classnames'

import CircularProgress from 'material-ui/lib/circular-progress'
import NavigationHelpers from 'common/NavigationHelpers'
import PortalListDialects from 'views/components/Browsing/portal-list-dialects'

// Operations
// import DirectoryOperations from "operations/DirectoryOperations"

// import Checkbox from "material-ui/lib/checkbox"
// import TextField from "material-ui/lib/text-field"
// import RaisedButton from "material-ui/lib/raised-button"
// import SelectField from "material-ui/lib/select-field"
// import MenuItem from "material-ui/lib/menus/menu-item"

// import withPagination from "views/hoc/grid-list/with-pagination"
// import withFilter from "views/hoc/grid-list/with-filter"
import IntlService from 'views/services/intl'

const intl = IntlService.instance

/**
 * Explore Archive page shows all the families in the archive
 */

const { func, object } = PropTypes

export class ExploreDialects extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computePortals: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    // REDUX: actions/dispatch/func
    fetchPortals: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  /*static contextTypes = {
        muiTheme: React.object.isRequired
    };*/

  constructor(props, context) {
    super(props, context)

    this.state = {
      filteredList: null,
      open: false,
    }

    this.titleFieldMapping = 'contextParameters.lightancestry.dialect.dc:title'
    this.logoFieldMapping = 'contextParameters.lightportal.fv-portal:logo'

    // Bind methods to 'this'
    ;['_portalEntriesSort'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  // Fetch data on initial render
  componentDidMount() {
    this._fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.area != this.props.routeParams.area) {
      this._fetchData(nextProps)
    }
  }

  render() {
    let introText1
    let introText2 = ''

    // TODO: determine which of the following can be moved to componentDidMount()
    // TODO: no need to re-declare/fetch data that doesn't change between renders
    //const computePortals = ProviderHelpers.getEntry(this.props.computePortals, this._getQueryPath())
    const portalsEntries = selectn('response.entries', this.props.computePortals) || []
    // Sort based on dialect name (all FVPortals have dc:title 'Portal')
    const sortedPortals = portalsEntries.sort(this._portalEntriesSort)

    const isLoggedIn = this.props.computeLogin.success && this.props.computeLogin.isConnected

    const portalListProps = {
      theme: this.props.routeParams.theme,
      filteredItems: this.state.filteredList,
      fieldMapping: {
        title: this.titleFieldMapping,
        logo: this.logoFieldMapping,
      },
      items: sortedPortals,
    }

    if (this.props.routeParams.area == 'Workspaces') {
      if (isLoggedIn) {
        introText1 = <p>You are part of the following Workspaces (community portals):</p>
      }

      introText2 = (
        <p>
          <a href={NavigationHelpers.generateStaticURL('/explore/FV/sections/Data')}>
            Click here to view all publicly available portals
          </a>
          {'or click on "Public View" (top right).'}
        </p>
      )
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <div className={classNames({ hidden: this.props.routeParams.theme === 'kids' })}>
              <h1>{intl.translate({ key: 'general.explore', default: 'Explore Languages', case: 'title' })}</h1>
            </div>
            {introText1}
            {this.props.computePortals && this.props.computePortals.isFetching ? (
              <div>
                <CircularProgress mode="indeterminate" style={{ verticalAlign: 'middle' }} size={1} /> Loading
              </div>
            ) : (
              <PortalListDialects {...portalListProps} />
            )}
            {introText2}
          </div>
        </div>
      </div>
    )
  }

  _fetchData(newProps) {
    newProps.fetchPortals(
      'get_dialects',
      { 'enrichers.document': 'lightancestry,lightportal', properties: '' },
      { queryParams: newProps.routeParams.area }
    )
  }

  _getQueryPath(props = this.props) {
    // Perform an API query for sections
    if (props.routeParams.area == 'sections') {
      // From s3 (static) (NOTE: when fetchPortals is fully switched remove headers from FVPortal to save OPTIONS call)
      return ConfGlobal.apiURL + 's3dialects/?area=' + props.routeParams.area

      // Proxy (not cached at the moment)
      //return 'https://api.firstvoices.com/v1/api/v1/query/get_dialects?queryParams=' + props.routeParams.area;
    }

    // Direct method
    return '/api/v1/query/get_dialects?queryParams=' + props.routeParams.area
  }

  _portalEntriesSort(a, b) {
    const a2 = selectn(this.titleFieldMapping, a)
    const b2 = selectn(this.titleFieldMapping, b)

    if (a2 < b2) return -1
    if (a2 > b2) return 1
    return 0
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPortal, navigation, nuxeo } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computePortals } = fvPortal

  return {
    computeLogin,
    computePortals,
    properties,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchPortals,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreDialects)
