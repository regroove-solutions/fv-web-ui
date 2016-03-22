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

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

/**
* Create word entry
*/
@provide
export default class PageDialectWordsCreate extends Component {

  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect: PropTypes.func.isRequired,
    computeDialect: PropTypes.object.isRequired,
    createWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onRequestSaveForm'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    let path = newProps.splitWindowPath.slice(1, newProps.splitWindowPath.length - 3).join('/');

    newProps.fetchDialect('/' + path);
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

  _onNavigateRequest(path) {
    //this.props.pushWindowPath('/' + path);
  }

  _onRequestSaveForm(e) {

    // Prevent default behaviour
    e.preventDefault();

    let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 3).join('/');
    let formValue = this.refs["form_word_create"].getValue();

    // Passed validation
    if (formValue) {

      let properties = '';

	  for (let key in formValue) {
	    if (formValue.hasOwnProperty(key) && key) {
	      if (formValue[key] && formValue[key] != '') {
	        properties += key + '=' + ((formValue[key] instanceof Array) ? JSON.stringify(formValue[key]) : formValue[key]) + ' \n';
	  	  }
	    }
	  }

	  this.props.createWord('/' + path + '/Dictionary', {
	    type: 'FVWord',
	    name: formValue['dc:title'],
	    properties: properties
	  });
    }

  }

  render() {

    const { computeDialect } = this.props;

    let dialect = computeDialect.response;

    if (computeDialect.isFetching) {
      return <CircularProgress mode="indeterminate" size={2} />;
    }

    return <div>

            <h1>Add New Word to <i>{dialect.get('dc:title')}</i></h1>
 
            <div className="row" style={{marginTop: '15px'}}>

              <div className={classNames('col-xs-8', 'col-md-10')}>
                <form onSubmit={this._onRequestSaveForm}>
                  <t.form.Form
                    ref="form_word_create"
                    type={t.struct(selectn("FVWord", fields))}
                    context={dialect}
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