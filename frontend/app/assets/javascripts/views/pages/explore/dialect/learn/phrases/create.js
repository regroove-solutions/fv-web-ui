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
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { createPhrase } from 'providers/redux/reducers/fvPhrase'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath, replaceWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'
import t from 'tcomb-form'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

// Views
import fields from 'models/schemas/fields'
import options from 'models/schemas/options'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
/**
 * Create phrase entry
 */

const { bool, array, func, object, string } = PropTypes
export class PageDialectPhrasesCreate extends Component {
  static propTypes = {
    embedded: bool,
    onDocumentCreated: func,
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computePhrase: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    createPhrase: func.isRequired,
    fetchDialect2: func.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
  }

  static defaultProps = {
    embedded: false,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      formValue: null,
      dialectPath: null,
      phrasePath: null,
    }

    // Bind methods to 'this'
    ;['_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    if (!selectn('response', ProviderHelpers.getEntry(newProps.computeDialect2, newProps.routeParams.dialect_path)))
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    let currentPhrase
    let nextPhrase

    if (this.state.phrasePath !== null) {
      currentPhrase = ProviderHelpers.getEntry(this.props.computePhrase, this.state.phrasePath)
      nextPhrase = ProviderHelpers.getEntry(nextProps.computePhrase, this.state.phrasePath)
    }

    if (this.props.onDocumentCreated && this.state.phrasePath && selectn('success', nextPhrase)) {
      this.props.onDocumentCreated(ProviderHelpers.getEntry(nextProps.computePhrase, this.state.phrasePath).response)
    }

    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps)
    }

    // 'Redirect' on success
    if (
      !this.props.embedded &&
      selectn('success', currentPhrase) != selectn('success', nextPhrase) &&
      selectn('success', nextPhrase) === true
    ) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', nextPhrase), 'phrases'),
        nextProps.replaceWindowPath,
        true
      )
    }
  }

  shouldComponentUpdate(newProps /*, newState*/) {
    switch (true) {
      case newProps.windowPath != this.props.windowPath:
        return true

      case newProps.computeDialect2 != this.props.computeDialect2:
        return true

      case newProps.computePhrase != this.props.computePhrase:
        return true
      default:
        return false
    }
  }

  _onRequestSaveForm(e) {
    // Prevent default behaviour
    e.preventDefault()

    // TODO: this.refs DEPRECATED
    const formValue = this.refs.form_phrase_create.getValue()

    //let properties = '';
    const properties = {}

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key) {
        if (formValue[key] && formValue[key] !== '') {
          //properties += key + '=' + ((formValue[key] instanceof Array) ? JSON.stringify(formValue[key]) : formValue[key]) + '\n';
          properties[key] = formValue[key]
        }
      }
    }

    this.setState({
      formValue: properties,
    })

    // Passed validation
    if (formValue) {
      const now = Date.now()
      this.props.createPhrase(
        this.props.routeParams.dialect_path + '/Dictionary',
        {
          type: 'FVPhrase',
          name: now.toString(),
          properties: properties,
        },
        null,
        now
      )

      this.setState({
        phrasePath: this.props.routeParams.dialect_path + '/Dictionary/' + now.toString() + '.' + now,
      })
    } else {
      //let firstError = this.refs["form_word_create"].validate().firstError();
      if (!this.props.embedded) window.scrollTo(0, 0)
    }
  }

  render() {
    const FVPhraseOptions = Object.assign({}, selectn('FVPhrase', options))

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.phrasePath,
        entity: this.props.computePhrase,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    // const computePhrase = ProviderHelpers.getEntry(this.props.computePhrase, this.state.phrasePath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Set default value on form
    if (
      selectn('fields.fv:definitions.item.fields.language.attrs', FVPhraseOptions) &&
      selectn('response.properties.fvdialect:dominant_language', computeDialect2)
    ) {
      FVPhraseOptions.fields['fv:definitions'].item.fields.language.attrs.defaultValue = selectn(
        'response.properties.fvdialect:dominant_language',
        computeDialect2
      )
    }

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <h1>
          {intl.trans('', 'Add New Phrase to ' + selectn('response.title', computeDialect2), null, [
            selectn('response.title', computeDialect2),
          ])}
        </h1>

        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-8', 'col-md-10')}>
            <form onSubmit={this._onRequestSaveForm}>
              <t.form.Form
                ref="form_phrase_create" // TODO: DEPRECATED
                type={t.struct(selectn('FVPhrase', fields))}
                context={selectn('response', computeDialect2)}
                value={this.state.formValue}
                options={FVPhraseOptions}
              />
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  {intl.trans('save', 'Save', 'first')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPhrase, windowPath } = state

  const { computePhrase } = fvPhrase
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computePhrase,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createPhrase,
  fetchDialect2,
  pushWindowPath,
  replaceWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectPhrasesCreate)
