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

import ConfGlobal from 'conf/local.json';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';
import ProviderHelpers from 'common/ProviderHelpers';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import Paper from 'material-ui/lib/paper';

import RaisedButton from 'material-ui/lib/raised-button';

import PageToolbar from 'views/pages/explore/dialect/page-toolbar';

const DEFAULT_LANGUAGE = 'english';

/**
* View BookEntry entry
*/
@provide
export default class View extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired, 
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    fetchBook: PropTypes.func.isRequired,
    computeBook: PropTypes.object.isRequired,
    fetchBookEntries: PropTypes.func.isRequired,
    computeBookEntries: PropTypes.object.isRequired,
    deleteBookEntry: PropTypes.func.isRequired,
    publishBookEntry: PropTypes.func.isRequired,
    askToPublishBookEntry: PropTypes.func.isRequired,
    unpublishBookEntry: PropTypes.func.isRequired,
    askToUnpublishBookEntry: PropTypes.func.isRequired,
    enableBookEntry: PropTypes.func.isRequired,
    askToEnableBookEntry: PropTypes.func.isRequired,
    disableBookEntry: PropTypes.func.isRequired,
    askToDisableBookEntry: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    book: PropTypes.object,
    typePlural: PropTypes.string
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      book: null,
      children: null
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_handleConfirmDelete', '_enableToggleAction', '_publishToggleAction'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchBook(this._getBookEntryPath(newProps));
    newProps.fetchBookEntries(this._getBookEntryPath(newProps));
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  _getBookEntryPath(props = null) {

    if (props == null) {
      props = this.props;
    }

    return props.routeParams.dialect_path + '/Stories & Songs/' + props.routeParams.bookName;
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  _handleConfirmDelete(item, event) {
    this.props.deleteBookEntry(item.uid);
    this.setState({deleteDialogOpen: false});
  }


  /**
  * Toggle dialect (enabled/disabled)
  */
  _enableToggleAction(toggled, workflow, path) {
    if (toggled) {
      if (workflow) {
        this.props.askToEnableBookEntry(path, {id: "FVEnableLanguageAsset", start: "true"}, null, "Request to enable Book Entry successfully submitted!", null);
      }
      else {
        this.props.enableBookEntry(path, null, null, "Book Entry enabled!");
      }
    } else {
      if (workflow) {
        this.props.askToDisableBookEntry(path, {id: "FVDisableLanguageAsset", start: "true"}, null, "Request to disable Book Entry successfully submitted!", null);
      }
      else {
        this.props.disableBookEntry(path, null, null, "Book Entry disabled!");
      }
    }
  }

  /**
  * Toggle published dialect
  */
  _publishToggleAction(toggled, workflow, path) {
    if (toggled) {
      if (workflow) {
        this.props.askToPublishBookEntry(path, {id: "FVPublishLanguageAsset", start: "true"}, null, "Request to publish Book Entry successfully submitted!", null);
      }
      else {
        this.props.publishBookEntry(path, null, null, "Book Entry published successfully!");
      }
    } else {
      if (workflow) {
        this.props.askToUnpublishBookEntry(path, {id: "FVUnpublishLanguageAsset", start: "true"}, null, "Request to unpublish Book Entry successfully submitted!", null);
      }
      else {
        this.props.unpublishBookEntry(path, null, null, "Book Entry unpublished successfully!");
      }
    }
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this._getBookEntryPath(),
      'entity': this.props.computeBook
    },{
      'id': this._getBookEntryPath(),
      'entity': this.props.computeBookEntries
    },{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }])

    const computeBook = ProviderHelpers.getEntry(this.props.computeBook, this._getBookEntryPath());
    const computeBookEntries = ProviderHelpers.getEntry(this.props.computeBookEntries, this._getBookEntryPath());
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    return <PromiseWrapper computeEntities={computeEntities}>
              <div className="row">
                <div className="col-xs-8">
                </div>
                <div className={classNames('col-xs-4', 'text-right')}>
                  <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeBook)}}>
                    <RaisedButton label="Create New Book Entry" onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/create')} primary={true} />
                  </AuthorizationFilter>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">

                  <h1>{selectn('response.title', computeBook)}</h1>

                  {(selectn('response.entries', computeBookEntries) || []).map((tile, tileKey) => 

                    <div className="row" style={{marginBottom: '20px'}}>

                      <div className="col-xs-12">

                      	<Paper style={{padding: '15px', margin: '20px 0'}} zDepth={2}>

                        {(() => {
                          if (this.props.routeParams.area == 'Workspaces') {

                            const { typePlural } = this.props;

                            if (tile)
                              return <PageToolbar
                                        label="Book Entry "
                                        handleNavigateRequest={this._onNavigateRequest.bind(this, '/explore' + selectn('path', tile).replace('Stories & Songs', 'learn/' + typePlural) + '/edit' )}
                                        computeEntity={{response: tile}}
                                        computePermissionEntity={computeDialect2}
                                        computeLogin={this.props.computeLogin}
                                        publishToggleAction={this._publishToggleAction}
                                        enableToggleAction={this._enableToggleAction}
                                        {...this.props} />;
                          }
                        })()}

		                    <div className="row" style={{marginBottom: '20px'}}>

		                      <div className="col-xs-12">
		                      	<p>
		                      		
                              {(() => {
                                return (selectn('properties.fv:related_pictures[0]', tile)) ? <img className="pull-left" style={{maxWidth: '300px', width: 'auto', marginRight: '15px'}} src={ConfGlobal.baseURL + 'nxfile/default/' + selectn('properties.fv:related_pictures[0]', tile) + '?inline=true'} /> : ''
                              })()}

		                      		{selectn('title', tile) || ''}<br/>

							                {selectn('properties.fvbookentry:dominant_language_text', tile).map(function(translation, i) {
		                              if (translation.language == DEFAULT_LANGUAGE) {
		                                return <span key={i}>
		                                  {translation.translation}
		                                </span>;
		                              }
	                            })}

							                {selectn('properties.fv:literal_translation', tile).map(function(translation, i) {
		                              if (translation.language == DEFAULT_LANGUAGE) {
		                                return <span key={i}>
		                                  {translation.translation}
		                                </span>;
		                              }
	                            })}

			                      	{(() => {
			                      		return (selectn('properties.fv:related_audio[0]', tile)) ? <audio src={ConfGlobal.baseURL + 'nxfile/default/' + selectn('properties.fv:related_audio[0]', tile) + '?inline=true'} controls /> : ''
			                      	})()}

		                      	</p>
		                      </div>

		                    </div>

                        </Paper>
                      </div>
                    </div>
                  )}

                </div>
              </div>
        </PromiseWrapper>;
  }
}
