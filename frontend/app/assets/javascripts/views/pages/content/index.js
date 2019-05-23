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
import Immutable from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { changeTitleParams } from 'providers/redux/reducers/navigation'
import { queryPage } from 'providers/redux/reducers/fvPage'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import classNames from 'classnames'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import TextHeader from 'views/components/Document/Typography/text-header'

import IntlService from 'views/services/intl'

const intl = IntlService.instance

/**
 * Explore Archive page shows all the families in the archive
 */

const { func, object, string } = PropTypes

export class PageContent extends Component {
  static propTypes = {
    area: string.isRequired,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeLogin: object.isRequired,
    computePage: object.isRequired,
    properties: object.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    queryPage: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  /*static contextTypes = {
        muiTheme: React.object.isRequired
    };*/

  constructor(props, context) {
    super(props, context)

    this.state = {
      mapVisible: false,
      pagePath: '/' + this.props.properties.domain + '/' + this.props.area + '/Site/Resources/',
      dialectsPath: '/' + this.props.properties.domain + '/' + this.props.area + '/',
    }
    ;['_onNavigateRequest'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath != this.props.windowPath) {
      this.fetchData(nextProps)
    }
  }

  fetchData(newProps) {
    newProps.queryPage(
      this.state.pagePath,
      " AND fvpage:url LIKE '" +
        StringHelpers.clean(newProps.routeParams.friendly_url) +
        "'" +
        '&sortOrder=ASC' +
        '&sortBy=dc:title'
    )
  }

  componentDidUpdate(/*prevProps, prevState*/) {
    const title = selectn(
      'response.entries[0].properties.dc:title',
      ProviderHelpers.getEntry(this.props.computePage, this.state.pagePath)
    )

    if (title && selectn('pageTitleParams.pageTitle', this.props.properties) != title) {
      this.props.changeTitleParams({ pageTitle: title })
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.state.pagePath,
        entity: this.props.computePage,
      },
    ])

    const computePage = ProviderHelpers.getEntry(this.props.computePage, this.state.pagePath)

    const page = selectn('response.entries[0].properties', computePage)

    // getting started page translated
    /*if (selectn('dc:title', page) === 'Get Started') {
            var originalContent = selectn('fvpage:blocks[0].text', page);
            var content = intl.trans('views.pages.get_started.page', originalContent)
            page['fvpage:blocks'][0]['text'] = content;
        }

        // contribute page translated
        else if (selectn('dc:title', page) === 'Contribute') {
            var originalContent = selectn('fvpage:blocks[0].text', page);
            var content = intl.trans('views.pages.contribute.page', originalContent)
            page['fvpage:blocks'][0]['text'] = content;
        }*/

    // const primary1Color = selectn('theme.palette.baseTheme.palette.primary1Color', this.props.properties)

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className={classNames('row')} style={{ margin: '25px 0' }}>
          <div className={classNames('col-xs-12')} style={{ marginBottom: '15px' }}>
            <TextHeader
              title={intl.searchAndReplace(selectn('fvpage:blocks[0].title', page), 'first')}
              tag="h1"
              properties={this.props.properties}
            />

            <div dangerouslySetInnerHTML={{ __html: selectn('fvpage:blocks[0].text', page) }} />
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvPage, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computePage } = fvPage
  const { _windowPath } = windowPath

  return {
    computeLogin,
    computePage,
    properties,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  queryPage,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageContent)
