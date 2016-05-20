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

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base';

import RaisedButton from 'material-ui/lib/raised-button';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import PageToolbar from 'views/pages/explore/dialect/page-toolbar';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import CircularProgress from 'material-ui/lib/circular-progress';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_LANGUAGE = 'english';

/**
* Learn songs
*/
@provide
export default class PageDialectLearnStoriesAndSongs extends PageDialectLearnBase {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    computeDocument: PropTypes.object.isRequired, 
    fetchDialect: PropTypes.func.isRequired,
    fetchBooksInPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired, 
    computeDialect: PropTypes.object.isRequired,
    computeBooksInPath: PropTypes.object.isRequired,
    deleteBook: PropTypes.func.isRequired,
    computeDeleteBook: PropTypes.object.isRequired,
    publishBook: PropTypes.func.isRequired,
    askToPublishBook: PropTypes.func.isRequired,
    unpublishBook: PropTypes.func.isRequired,
    askToUnpublishBook: PropTypes.func.isRequired,
    enableBook: PropTypes.func.isRequired,
    askToEnableBook: PropTypes.func.isRequired,
    disableBook: PropTypes.func.isRequired,
    askToDisableBook: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    typePlural: PropTypes.string,
    typeFilter: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      expandedCards: [],
      typeFilter: props.typeFilter
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_handleConfirmDelete', '_enableToggleAction', '_publishToggleAction', '_handleRefetch', '_handleShowMoreDetails', '_handleFilterEntries'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect(newProps.routeParams.dialect_path);
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Stories & Songs');
    newProps.fetchBooksInPath(newProps.routeParams.dialect_path, '&currentPageIndex=' + DEFAULT_PAGE + '&pageSize=' + DEFAULT_PAGE_SIZE, { 'X-NXenrichers.document': 'ancestry,permissions', 'X-NXproperties': 'dublincore, fvbook, fvcore' });
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

  _handleConfirmDelete(item, event) {
    this.props.deleteBook(item.uid);
    this.setState({deleteDialogOpen: false});
  }

  /**
  * Toggle dialect (enabled/disabled)
  */
  _enableToggleAction(toggled, workflow, path) {
    if (toggled) {
      if (workflow) {
        this.props.askToEnableBook(path, {id: "FVEnableLanguageAsset", start: "true"}, null, "Request to enable book successfully submitted!", null);
      }
      else {
        this.props.enableBook(path, null, null, "Book enabled!");
      }
    } else {
      if (workflow) {
        this.props.askToDisableBook(path, {id: "FVDisableLanguageAsset", start: "true"}, null, "Request to disable book successfully submitted!", null);
      }
      else {
        this.props.disableBook(path, null, null, "Book disabled!");
      }
    }
  }

  /**
  * Toggle published dialect
  */
  _publishToggleAction(toggled, workflow, path) {
    if (toggled) {
      if (workflow) {
        this.props.askToPublishBook(path, {id: "FVPublishLanguageAsset", start: "true"}, null, "Request to publish book successfully submitted!", null);
      }
      else {
        this.props.publishBook(path, null, null, "Book published successfully!");
      }
    } else {
      if (workflow) {
        this.props.askToUnpublishBook(path, {id: "FVUnpublishLanguageAsset", start: "true"}, null, "Request to unpublish book successfully submitted!", null);
      }
      else {
        this.props.unpublishBook(path, null, null, "Book unpublished successfully!");
      }
    }
  }

  _handleRefetch(dataGridProps, page, pageSize) {
    let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 2).join('/');
    this.props.fetchBooksInPath('/' + path, '&currentPageIndex=' + page + '&pageSize=' + pageSize, { 'X-NXproperties': 'dublincore, fvbook, fvcore' });
  }

  _handleFilterEntries(e, index, value) {
    this.setState({
      typeFilter: value
    })
  }

  _handleShowMoreDetails(id) {

    let newArray;
    let idPos = this.state.expandedCards.indexOf(id);

    // If not expanded, add to array
    if (idPos === -1) {
      newArray = this.state.expandedCards.concat([id]);
    } else {
      newArray = this.state.expandedCards.slice(0);
      newArray.splice(idPos, 1);
    }

    this.setState({
      expandedCards: newArray
    });
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  render() {

    const { computeDialect, computeBooksInPath, computeLogin } = this.props;

    let dialect = computeDialect.response;

    let books = selectn('response.entries', computeBooksInPath) || [];

    if (books.length > 0 && this.state.typeFilter) {
      books = books.filter(function(book) {
        return selectn('properties.fvbook:type', book) == this.state.typeFilter;
      }.bind(this));
    }

    if (computeBooksInPath.isFetching) {
      return <CircularProgress mode="indeterminate" size={5} />;
    }

    const computeDocument = ProviderHelpers.getEntry(this.props.computeDocument, this.props.routeParams.dialect_path + '/Stories & Songs');

    return <div>
              <div className="row">
                <div className="col-xs-8">
                  <strong>Displaying: </strong>
                  <DropDownMenu value={this.state.typeFilter} onChange={this._handleFilterEntries}>
                    <MenuItem value={null} primaryText="All"/>
                    <MenuItem value="song" primaryText="Only Songs"/>
                    <MenuItem value="story" primaryText="Only Stories"/>
                  </DropDownMenu>
                </div>
                <div className={classNames('col-xs-4', 'text-right')}>
                  <AuthorizationFilter filter={{role: ['Record', 'Approve', 'Everything'], entity: selectn('response', computeDocument), login: this.props.computeLogin}}>
                    <RaisedButton label="Create Song/Story Book" onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/create')} primary={true} />
                  </AuthorizationFilter>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">

                  <h1>{dialect.get('dc:title')} Songs &amp; Stories</h1>

                  {books.map((tile, tileKey) => 

                    <div key={tileKey} className="row" style={{marginBottom: '20px'}}>

                      <div className="col-xs-12">

                        <Card key={tileKey}>

                          <CardHeader
                            title={tile.title}
                            subtitle={selectn('properties.fvbook:title_literal_translation', tile).map(function(translation, i) {
                              if (translation.language == DEFAULT_LANGUAGE) {
                                return <span key={i}>
                                  {translation.translation}
                                </span>;
                              }
                            })} />

                          {(() => {
                            if (this.props.routeParams.area == 'Workspaces') {

                              const { typePlural } = this.props;

                              if (tile)
                                return <PageToolbar
                                          label="Book"
                                          handleNavigateRequest={this._onNavigateRequest.bind(this, '/explore' + selectn('path', tile).replace('Stories & Songs', 'learn/' + typePlural) + '/edit' )}
                                          computeEntity={{response: tile}}
                                          computeLogin={computeLogin}
                                          computePermissionEntity={computeDialect}
                                          publishToggleAction={this._publishToggleAction}
                                          enableToggleAction={this._enableToggleAction}
                                          {...this.props} />;
                            }
                          })()}

                          <CardMedia style={{display: (!selectn('properties.fv:related_pictures[0]', tile) ? 'none' : 'block')}}>
                            <img style={{minWidth: 'inherit', width: 'inherit'}} src={ConfGlobal.baseURL + 'nxfile/default/' + selectn('properties.fv:related_pictures[0]', tile) + '?inline=true'} />
                          </CardMedia>

                          <CardActions>
                            <FlatButton disabled={!selectn('properties.fvbook:introduction', tile)} label={((this.state.expandedCards.indexOf(tileKey) == -1) ? 'Show' : 'Hide') + ' Details'} onTouchTap={this._handleShowMoreDetails.bind(this, tileKey)}/>
                            <FlatButton onTouchTap={this._onNavigateRequest.bind(this, '/explore' + tile.path.replace('Stories & Songs', 'learn/' + (selectn('properties.fvbook:type', tile) == 'story' ? 'stories' : 'songs') ))} primary={true} label={'View ' + (selectn('properties.fvbook:type', tile) || 'Entry')} />
                          </CardActions>

                          <CardText style={{display: (this.state.expandedCards.indexOf(tileKey) == -1) ? 'none' : 'block'}}>

                            <Tabs> 
                              <Tab label="Introduction" > 
                                <div> 
                                    {selectn('properties.fvbook:introduction', tile)}
                                </div> 
                              </Tab> 
                              <Tab label={DEFAULT_LANGUAGE}> 
                                <div> 
                                    {selectn('properties.fvbook:introduction_literal_translation', tile).map(function(translation, i) {
                                        if (translation.language == DEFAULT_LANGUAGE) {
                                          return <div key={i}>
                                            {translation.translation}
                                          </div>;
                                        }
                                      })}
                                </div> 
                              </Tab> 
                            </Tabs> 

                          </CardText>

                        </Card>
                      </div>
                    </div>
                  )}

                </div>
              </div>
        </div>;
  }
}
