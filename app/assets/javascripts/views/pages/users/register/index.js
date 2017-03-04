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
import React, {Component, PropTypes} from 'react';
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';
import {User} from 'nuxeo';

import ProviderHelpers from 'common/ProviderHelpers';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Views
import RaisedButton from 'material-ui/lib/raised-button';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

/**
* Create user entry
*/
@provide
export default class PageDialectWordsCreate extends Component {

  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
	inviteUser: PropTypes.func.isRequired,
	fetchUser: PropTypes.func.isRequired,
    computeUser: PropTypes.object.isRequired,
	computeLogin: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      formValue: null,
      wordPath: null
    };

    // Bind methods to 'this'
    ['_onRequestSaveForm'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    //newProps.fetchDialect2(newProps.routeParams.dialect_path);
	newProps.fetchUser('Administrator');
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {

    let currentWord, nextWord;

    if (this.state.wordPath != null) {
      currentWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath);
      nextWord = ProviderHelpers.getEntry(nextProps.computeWord, this.state.wordPath);
    }

    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps);
    }

    // 'Redirect' on success
    if (selectn('success', currentWord) != selectn('success', nextWord) && selectn('success', nextWord) === true) {
        nextProps.replaceWindowPath('/' + nextProps.routeParams.theme + selectn('response.path', nextWord).replace('Dictionary', 'learn/words'));
    }
  }

  shouldComponentUpdate(newProps, newState) {

    switch (true) {
      case (newProps.windowPath != this.props.windowPath):
        return true;
      break;

      case (newProps.computeDialect2 != this.props.computeDialect2):
        return true;
      break;

      case (newProps.computeWord != this.props.computeWord):
        return true;
      break;
    }

    return false;
  }

  _onRequestSaveForm(currentUser, e) {

    // Prevent default behaviour
    e.preventDefault();

    let formValue = this.refs["form_user_create"].getValue();

    let properties = {};
    
	for (let key in formValue) {
	if (formValue.hasOwnProperty(key) && key) {
		if (formValue[key] && formValue[key] != '') {
			properties[key] = formValue[key];
		}
	}
	}

    this.setState({
      formValue: properties
    })

    // Passed validation
    if (formValue) {
		let nuxeoPrincipal = new User(properties, { 
			'repository': currentUser.response._repository,
			'nuxeo': currentUser.response._nuxeo
      	});
		this.props.inviteUser(nuxeoPrincipal);
		//this.props.createUser({'properties': properties});
    } else {
      window.scrollTo(0, 0);
    }

  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.state.wordPath,
      'entity': this.props.computeWord
    }, {
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }])

    const computeWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath);
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <h1>Register <i>{selectn('response.title', computeDialect2)}</i></h1>

            <div className="row" style={{marginTop: '15px'}}>

              <div className={classNames('col-xs-8', 'col-md-10')}>
                <form onSubmit={this._onRequestSaveForm.bind(this, this.props.computeLogin)}>
                  <t.form.Form
                    ref="form_user_create"
                    type={t.struct(selectn("FVUser", fields))}
                    context={selectn('response', computeDialect2)}
                    value={this.state.formValue}
                    options={Object.assign({}, selectn("FVUser", options))} />
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">Save</button> 
                    </div>
                </form>

              </div>

            </div>
  
        </PromiseWrapper>;
  }
}