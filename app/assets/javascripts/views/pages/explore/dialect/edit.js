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
export default class ExploreDialectEdit extends Component {

  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    updatePortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired
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
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal');
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      this.fetchData(nextProps);
    }
  }

  _onNavigateRequest(path) {
    //this.props.pushWindowPath('/' + path);
  }

  shouldComponentUpdate(newProps) {

    const portalPath = this.props.routeParams.dialect_path + '/Portal';

    switch (true) {
      case (newProps.routeParams.dialect_path != this.props.routeParams.dialect_path):
        return true;
      break;

      case (ProviderHelpers.getEntry(newProps.computePortal, portalPath) != ProviderHelpers.getEntry(this.props.computePortal, portalPath)):
        return true;
      break;

      case (ProviderHelpers.getEntry(newProps.computeDialect2, this.props.routeParams.dialect_path) != ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)):
        return true;
      break;
    }

    return false;
  }

  _onRequestSaveForm(portal, e) {

    // Prevent default behaviour
    e.preventDefault();

    let formValue = this.refs["form_portal"].getValue();

    // Passed validation
    if (formValue) {

      // TODO: Find better way to construct object then accessing internal function
      // Create new document rather than modifying the original document
      let newDocument = new Document(portal.response, { 
        'repository': portal.response._repository,
        'nuxeo': portal.response._nuxeo
      });

      // Set new value property on document
      newDocument.set(formValue);

      // Save document
      this.props.updatePortal(newDocument);
    }

  }

  render() {

    const portalPath = this.props.routeParams.dialect_path + '/Portal';

    const computeEntities = Immutable.fromJS([{
      'id': portalPath,
      'entity': this.props.computePortal
    }, {
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }])

    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, portalPath);
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    let initialValues = {};

    // Set initial values
    if (selectn('response', computeDialect2) && selectn('response', computePortal)) {
      initialValues = Object.assign(selectn('response', computeDialect2), {initialValues: selectn("response.properties", computePortal)})
    }

    return <PromiseWrapper computeEntities={computeEntities}>

              <div className="form-horizontal">

                <h1>Edit {selectn('response.title', computeDialect2)} Community Portal</h1>
   
                <div className="row" style={{marginTop: '15px'}}>

                  <div className={classNames('col-xs-8', 'col-md-10')}>
                    <form onSubmit={this._onRequestSaveForm.bind(this, computePortal)}>
                      <t.form.Form
                        ref="form_portal"
                        type={t.struct(selectn("FVPortal", fields))}
                        context={initialValues}
                        value={selectn("response.properties", computePortal)}
                        options={selectn("FVPortal", options)} />
                        <div className="form-group">
                          <button type="submit" className="btn btn-primary">Save</button> 
                        </div>
                    </form>
                  </div>

                  <div className={classNames('col-xs-4', 'col-md-2')}>

                    <div style={{marginTop: '25px'}} className={classNames('panel', 'panel-primary')}>

                      <div className="panel-heading">Metadata</div>

                      <ul className="list-group">

                        <li className="list-group-item">
                          <span className={classNames('label', 'label-default')}>Last Modified</span><br/>
                          {selectn("response.lastModified", computePortal)}
                        </li>

                        <li className="list-group-item">
                          <span className={classNames('label', 'label-default')}>Last Contributor</span><br/>
                          {selectn("response.properties.dc:lastContributor", computePortal)}
                        </li>

                        <li className="list-group-item">
                          <span className={classNames('label', 'label-default')}>Date Created</span><br/>
                          {selectn("response.properties.dc:created", computePortal)}
                        </li>

                        <li className="list-group-item">
                          <span className={classNames('label', 'label-default')}>Contributors</span><br/>
                          {(selectn("response.properties.dc:contributors", computePortal) || []).join(',')}
                        </li>

                        <li className="list-group-item">
                          <span className={classNames('label', 'label-default')}>Version</span><br/>
                          {selectn("response.properties.uid:major_version", computePortal)}.{selectn("response.properties.uid:minor_version", computePortal)} 
                        </li>

                      </ul>

                    </div>

                  </div>
              </div>

            </div>

        </PromiseWrapper>;
  }
}