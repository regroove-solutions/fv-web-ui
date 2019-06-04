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
import { changeTitleParams, overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchPhrase, updatePhrase } from 'providers/redux/reducers/fvPhrase'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import StringHelpers from 'common/StringHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

// Models
import { Document } from 'nuxeo'

// Views
import fields from 'models/schemas/fields'
import options from 'models/schemas/options'

import withForm from 'views/hoc/view/with-form'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const EditViewWithForm = withForm(PromiseWrapper, true)

const { array, func, object } = PropTypes
export class PageDialectPhraseEdit extends Component {
  static propTypes = {
    phrase: object,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computePhrase: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    // REDUX: actions/dispatch/func
    changeTitleParams: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchPhrase: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    updatePhrase: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      formValue: null,
    }

    // Bind methods to 'this'
    ;['_handleSave', '_handleCancel'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    newProps.fetchDialect2(this.props.routeParams.dialect_path)
    newProps.fetchPhrase(this._getPhrasePath())
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentPhrase
    let nextPhrase

    if (this._getPhrasePath() !== null) {
      currentPhrase = ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath())
      nextPhrase = ProviderHelpers.getEntry(nextProps.computePhrase, this._getPhrasePath())
    }

    // 'Redirect' on success
    if (
      selectn('wasUpdated', currentPhrase) != selectn('wasUpdated', nextPhrase) &&
      selectn('wasUpdated', nextPhrase) === true
    ) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', nextPhrase), 'phrases'),
        nextProps.replaceWindowPath,
        true
      )
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    const previousPhrase = this.props.computePhrase
    const nextPhrase = newProps.computePhrase

    const previousDialect = this.props.computeDialect2
    const nextDialect = newProps.computeDialect2

    // TODO: `switch (true)`?
    switch (true) {
      case newProps.routeParams.phrase != this.props.routeParams.phrase:
        return true

      case newProps.routeParams.dialect_path != this.props.routeParams.dialect_path:
        return true

      case typeof nextPhrase.equals === 'function' && nextPhrase.equals(previousPhrase) === false:
        return true

      case typeof nextDialect.equals === 'function' && nextDialect.equals(previousDialect) === false:
        return true
      default:
        return false
    }
  }

  _getPhrasePath(props = null) {
    const _props = props === null ? this.props : props

    if (StringHelpers.isUUID(_props.routeParams.phrase)) {
      return _props.routeParams.phrase
    }
    return _props.routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(_props.routeParams.phrase)
  }

  _handleSave(phrase, formValue) {
    const newDocument = new Document(phrase.response, {
      repository: phrase.response._repository,
      nuxeo: phrase.response._nuxeo,
    })

    // Set new value property on document
    newDocument.set(formValue)

    // Save document
    this.props.updatePhrase(newDocument, null, null)

    this.setState({ formValue: formValue })
  }

  _handleCancel() {
    NavigationHelpers.navigateUp(this.props.splitWindowPath, this.props.replaceWindowPath)
  }

  componentDidUpdate(/*prevProps, prevState*/) {
    const phrase = selectn('response', ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath()))
    const title = selectn('properties.dc:title', phrase)
    const uid = selectn('uid', phrase)

    if (title && selectn('pageTitleParams.phrase', this.props.properties) != title) {
      this.props.changeTitleParams({ phrase: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.phrase' })
    }
  }

  render() {
    let context

    const computeEntities = Immutable.fromJS([
      {
        id: this._getPhrasePath(),
        entity: this.props.computePhrase,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computePhrase = ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Additional context (in order to store origin), and initial filter value
    if (selectn('response', computeDialect2) && selectn('response', computePhrase)) {
      const providedFilter =
        selectn('response.properties.fv-phrase:definitions[0].translation', computePhrase) ||
        selectn('response.properties.fv:literal_translation[0].translation', computePhrase)
      context = Object.assign(selectn('response', computeDialect2), {
        otherContext: {
          parentId: selectn('response.uid', computePhrase),
          providedFilter: providedFilter,
        },
      })
    }

    return (
      <div>
        <h1>
          {intl.trans(
            'views.pages.explore.dialect.phrases.edit_x_phrase',
            'Edit ' + selectn('response.properties.dc:title', computePhrase) + ' phrase',
            'first',
            [selectn('response.properties.dc:title', computePhrase)]
          )}
        </h1>

        <EditViewWithForm
          computeEntities={computeEntities}
          initialValues={context}
          itemId={this._getPhrasePath()}
          fields={fields}
          options={options}
          saveMethod={this._handleSave}
          cancelMethod={this._handleCancel}
          currentPath={this.props.splitWindowPath}
          navigationMethod={this.props.replaceWindowPath}
          type="FVPhrase"
          routeParams={this.props.routeParams}
        />
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPhrase, navigation, windowPath } = state

  const { computePhrase } = fvPhrase
  const { computeDialect2 } = fvDialect
  const { splitWindowPath } = windowPath
  const { properties } = navigation
  return {
    computeDialect2,
    computePhrase,
    properties,
    splitWindowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  changeTitleParams,
  fetchDialect2,
  fetchPhrase,
  overrideBreadcrumbs,
  pushWindowPath,
  replaceWindowPath,
  updatePhrase,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectPhraseEdit)
