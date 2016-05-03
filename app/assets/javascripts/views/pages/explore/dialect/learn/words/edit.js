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
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';

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
      wordPath: null
    };
    
    // Bind methods to 'this'
    ['_onNavigateRequest', '_onRequestSaveForm'].forEach( (method => this[method] = this[method].bind(this)) );    
  }

  fetchData(newProps) {

    let pathArray = newProps.splitWindowPath.slice(1);

    // Remove 'learn' from path
    pathArray.splice(pathArray.indexOf('learn'), 1);

    // Replace words with Dictionary
    pathArray[pathArray.indexOf('words')] = 'Dictionary';

    // Remove 'edit' from path
    pathArray.splice(pathArray.indexOf('edit'), 1);	    
    
    let path = decodeURI(pathArray.join('/'));

    this.setState({
      wordPath: path
    });
    
    //console.log(path);
    //path = decodeURI(path);
    //console.log(path);

    newProps.fetchWord('/' + path);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }  
  
  _onRequestSaveForm(e) {

    // Prevent default behaviour
    e.preventDefault();

    let formValue = this.refs["form_word"].getValue();

    // Passed validation
    if (formValue) {
    	
      // TODO: Find better way to construct object then accessing internal function
      // Create new document rather than modifying the original document
      let newDocument = new Document(this.props.computeWord.words['/' + this.state.wordPath].response, { 
        'repository': this.props.computeWord.words['/' + this.state.wordPath].response._repository,
        'nuxeo': this.props.computeWord.words['/' + this.state.wordPath].response._nuxeo
      });

      // Set new value property on document
      newDocument.set(formValue);

      //console.log(newDocument);	
      
      // Save document
      this.props.updateWord(newDocument);
    }

  }  

  _onNavigateRequest(path) {
    //this.props.pushWindowPath('/' + path);
  }  
  
  render() {

    const { computeWord } = this.props;

    let word = selectn('words[/' + this.state.wordPath + ']', computeWord);
    let wordResponse = selectn('response', word);

    if (!wordResponse || !word || !word.success) {
        return <CircularProgress mode="indeterminate" size={5} />;
    }
    
    //console.log(wordResponse.properties);

    return <div>

	    <h1>edit {wordResponse.properties['dc:title']} word</h1>
	
	    <div className="row" style={{marginTop: '15px'}}>
	
	      <div className={classNames('col-xs-8', 'col-md-10')}>
	        <form onSubmit={this._onRequestSaveForm}>
	          <t.form.Form
	            ref="form_word"
	            type={t.struct(selectn("FVWord", fields))}
	            context={selectn("properties", wordResponse)}
	            value={selectn("properties", wordResponse)}
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