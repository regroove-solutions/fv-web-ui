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

import ProviderHelpers from 'common/ProviderHelpers';

// Models
import {Document} from 'nuxeo';

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

@provide
export default class PageDialectWordEdit extends Component {
  
  static propTypes = {
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired,
    updateWord: PropTypes.func.isRequired,
    word: PropTypes.object
  };
  
  constructor(props, context){
    super(props, context);

    this.state = {
      word: null,
      wordPath: null,
      formValue: null
    };

    // Bind methods to 'this'
    ['_onRequestSaveForm'].forEach( (method => this[method] = this[method].bind(this)) );    
  }

  fetchData(newProps) {

    let dialectPath = ProviderHelpers.getDialectPathFromURLArray(newProps.splitWindowPath);
    let wordPath = '/' + dialectPath + '/Dictionary/' + decodeURI(newProps.splitWindowPath[newProps.splitWindowPath.length - 1]);

    this.setState({
      wordPath: wordPath
    });

    newProps.fetchWord(wordPath);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }  

  shouldComponentUpdate(newProps, newState) {

    switch (true) {
      case (newProps.windowPath != this.props.windowPath):
        return true;
      break;
      
      case (newProps.computeWord != this.props.computeWord):
        return true;
      break;
    }

    return false;
  }

  _onRequestSaveForm(e) {

    // Prevent default behaviour
    e.preventDefault();

    let formValue = this.refs["form_word"].getValue();

    this.setState({ formValue: formValue});

    let word = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath);

    // Passed validation
    if (formValue) {
    	
      // TODO: Find better way to construct object then accessing internal function
      // Create new document rather than modifying the original document
      let newDocument = new Document(word.response, { 
        'repository': word.response._repository,
        'nuxeo': word.response._nuxeo
      });

      // Set new value property on document
      newDocument.set(formValue);

      // Save document
      this.props.updateWord(newDocument);
    }

  }  

  render() {

    const { computeWord } = this.props;

    let word = ProviderHelpers.getEntry(computeWord, this.state.wordPath);

    let wordResponse = selectn('response', word);

    if (!word || word.isFetching) {
        return <CircularProgress mode="indeterminate" size={5} />;
    }

    return <div>

	    <h1>Edit {selectn("properties.dc:title", wordResponse)} word</h1>

      {word.isError ? <div className="alert alert-danger" role="alert">{word.error}</div> : ''}
	
	    <div className="row" style={{marginTop: '15px'}}>
	
	      <div className={classNames('col-xs-8', 'col-md-10')}>
	        <form onSubmit={this._onRequestSaveForm}>
	          <t.form.Form
	            ref="form_word"
	            type={t.struct(selectn("FVWord", fields))}
	            context={selectn("properties", wordResponse)}
              value={this.state.formValue || selectn("properties", wordResponse)}
	            options={selectn("FVWord", options)} />
	            <div className="form-group">
	              <button type="submit" className="btn btn-primary">Save</button> 
	            </div>
	        </form>
	      </div>
	
	      <div className={classNames('col-xs-4', 'col-md-2')}>
	
	        <Paper style={{padding: '15px', margin: '20px 0'}} zDepth={2}>
	
	          <div className="subheader">Metadata</div>
	
	        </Paper>
	
	      </div>
	  </div>
	</div>;
  }
}