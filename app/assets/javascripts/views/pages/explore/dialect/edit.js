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

// Models
import {Document} from 'nuxeo';

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';

@provide
export default class ExploreDialectEdit extends Component {

  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect: PropTypes.func.isRequired,
    computeDialect: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    updatePortal: PropTypes.func.isRequired,
    computePortalUpdate: PropTypes.object.isRequired
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onRequestSaveForm'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    let dialectPath = ProviderHelpers.getDialectPathFromURLArray(newProps.splitWindowPath).join('/');

    newProps.fetchDialect('/' + dialectPath);
    newProps.fetchPortal('/' + dialectPath + '/Portal');
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

  shouldComponentUpdate(newProps) {

    switch (true) {
      case (newProps.windowPath != this.props.windowPath):
        return true;
      break;

      case (newProps.computePortal.response != this.props.computePortal.response):
        return true;
      break;

      case (newProps.computeDialect.response != this.props.computeDialect.response):
        return true;
      break;

      case (newProps.computePortalUpdate.response != this.props.computePortalUpdate.response):
        return false; // TODO: Change to true and handle submit
      break;
    }

    return false;
  }

  _onRequestSaveForm(e) {

    // Prevent default behaviour
    e.preventDefault();

    let formValue = this.refs["form_portal"].getValue();

    // Passed validation
    if (formValue) {

      // TODO: Find better way to construct object then accessing internal function
      // Create new document rather than modifying the original document
      let newDocument = new Document(this.props.computePortal.response, { 
        'repository': this.props.computePortal.response._repository,
        'nuxeo': this.props.computePortal.response._nuxeo
      });

      // Set new value property on document
      newDocument.set(formValue);

      // Save document
      this.props.updatePortal(newDocument);
    }

  }

  render() {

    const { computeDialect, computePortal, computePortalUpdate } = this.props;

    let dialect = computeDialect.response;
    let portal = computePortal.response;

    if (computeDialect.isFetching || computePortal.isFetching || !computePortal.success || !computeDialect.success) {
      return <CircularProgress mode="indeterminate" size={2} />;
    }

    return <div>

            <h1>Edit {dialect.get('dc:title')} Community Portal</h1>
 
            <div className="row" style={{marginTop: '15px'}}>

              <div className={classNames('col-xs-8', 'col-md-10')}>
                <form onSubmit={this._onRequestSaveForm}>
                  <t.form.Form
                    ref="form_portal"
                    type={t.struct(selectn("FVPortal", fields))}
                    context={Object.assign(dialect, {initialValues: selectn("properties", portal)})}
                    value={selectn("properties", portal)}
                    options={selectn("FVPortal", options)} />
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