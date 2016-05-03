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

import ProviderHelpers from 'common/ProviderHelpers';

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';
import Snackbar from 'material-ui/lib/snackbar';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

/**
* Create song/story book
*/
@provide
export default class PageDialectStoriesAndSongsCreate extends Component {

  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect: PropTypes.func.isRequired,
    computeDialect: PropTypes.object.isRequired,
    createBook: PropTypes.func.isRequired,
    computeCreateBook: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      formValue: null,
      dialectPath: null
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onRequestSaveForm'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    let dialectPath = ProviderHelpers.getDialectPathFromURLArray(newProps.splitWindowPath).join('/');

    this.setState({dialectPath: dialectPath});

    newProps.fetchDialect('/' + dialectPath);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps);
    }
  }

  shouldComponentUpdate(newProps, newState) {

    switch (true) {
      case (newProps.windowPath != this.props.windowPath):
        return true;
      break;

      case (newProps.computeDialect.response != this.props.computeDialect.response):
        return true;
      break;
      
      case (newProps.computeCreateBook.error != this.props.computeCreateBook.error):
        return true;
      break;
    }

    return false;
  }

  _onNavigateRequest(path) {
    //this.props.pushWindowPath('/' + path);
  }

  _onRequestSaveForm(e) {

    // Prevent default behaviour
    e.preventDefault();

    let formValue = this.refs["form_book_create"].getValue();

    //let properties = '';
    let properties = {};
    
	  for (let key in formValue) {
	    if (formValue.hasOwnProperty(key) && key) {
	      if (formValue[key] && formValue[key] != '') {
	        //properties += key + '=' + ((formValue[key] instanceof Array) ? JSON.stringify(formValue[key]) : formValue[key]) + '\n';
	    	  properties[key] = formValue[key];
	  	  }
	    }
	  }

    this.setState({
      formValue: properties
    })

    // Passed validation
    if (formValue) {
  	  this.props.createBook('/' + this.state.dialectPath + '/Stories & Songs', {
  	    type: 'FVBook',
  	    name: formValue['dc:title'],
  	    properties: properties
  	  });
    }

  }

  render() {

    const { computeDialect, computeCreateBook } = this.props;

    let dialect = computeDialect.response;

    if (computeDialect.isFetching || !computeDialect.success) {
      return <CircularProgress mode="indeterminate" size={2} />;
    }

    return <div>

            <h1>Add New Book to <i>{dialect.get('dc:title')}</i></h1>
            
            {computeCreateBook.isError ? <div className="alert alert-danger" role="alert">{computeCreateBook.error}</div> : ''}
            
            <div className="row" style={{marginTop: '15px'}}>

              <div className={classNames('col-xs-8', 'col-md-10')}>
                <form onSubmit={this._onRequestSaveForm}>
                  <t.form.Form
                    ref="form_book_create"
                    type={t.struct(selectn("FVBook", fields))}
                    context={dialect}
                    value={this.state.formValue}
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
        </div>;
  }
}