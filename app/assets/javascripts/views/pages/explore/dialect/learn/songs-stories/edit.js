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
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

// Models
import {Document} from 'nuxeo';

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

@provide
export default class PageDialectBookEdit extends Component {
  
  static propTypes = {
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchBook: PropTypes.func.isRequired,
    computeBook: PropTypes.object.isRequired,
    updateBook: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    book: PropTypes.object
  };
  
  constructor(props, context){
    super(props, context);

    this.state = {
      book: null,
      bookPath: props.routeParams.dialect_path + '/Stories & Songs/' + props.routeParams.bookName,
      formValue: null
    };

    // Bind methods to 'this'
    ['_onRequestSaveForm'].forEach( (method => this[method] = this[method].bind(this)) );    
  }

  fetchData(newProps) {
    newProps.fetchDialect2(this.props.routeParams.dialect_path);
    newProps.fetchBook(this.state.bookPath);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }  

  shouldComponentUpdate(newProps, newState) {

    switch (true) {

      case (newProps.routeParams.bookName != this.props.routeParams.bookName):
        return true;
      break;

      case (newProps.routeParams.dialect_path != this.props.routeParams.dialect_path):
        return true;
      break;

      case (ProviderHelpers.getEntry(newProps.computeBook, this.state.bookPath) != ProviderHelpers.getEntry(this.props.computeBook, this.state.bookPath)):
        return true;
      break;

      case (ProviderHelpers.getEntry(newProps.computeDialect2, this.props.routeParams.dialect_path) != ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)):
        return true;
      break;
    }

    return false;
  }

  _onRequestSaveForm(e) {

    // Prevent default behaviour
    e.preventDefault();

    let formValue = this.refs["form_book"].getValue();

    // Passed validation
    if (formValue) {
      let book = ProviderHelpers.getEntry(this.props.computeBook, this.state.bookPath);

      // TODO: Find better way to construct object then accessing internal function
      // Create new document rather than modifying the original document
      let newDocument = new Document(book.response, { 
        'repository': book.response._repository,
        'nuxeo': book.response._nuxeo
      });

      // Set new value property on document
      newDocument.set(formValue);

      // Save document
      this.props.updateBook(newDocument);

      this.setState({ formValue: formValue });
    } else {
      window.scrollTo(0, 0);
    }
  }  

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.state.bookPath,
      'entity': this.props.computeBook
    }, {
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }])

    const computeBook = ProviderHelpers.getEntry(this.props.computeBook, this.state.bookPath);
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

	    <h1>Edit {selectn("response.properties.dc:title", computeBook)} book</h1>

	    <div className="row" style={{marginTop: '15px'}}>
	
	      <div className={classNames('col-xs-8', 'col-md-10')}>
	        <form onSubmit={this._onRequestSaveForm}>
	          <t.form.Form
	            ref="form_book"
	            type={t.struct(selectn("FVBook", fields))}
	            context={selectn("response", computeDialect2)}
              value={this.state.formValue || selectn("response.properties", computeBook)}
	            options={selectn("FVBook", options)} />
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
	</PromiseWrapper>;
  }
}