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

import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base';

import RaisedButton from 'material-ui/lib/raised-button';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

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
    fetchDialect: PropTypes.func.isRequired,
    fetchBooksInPath: PropTypes.func.isRequired,
    computeDialect: PropTypes.object.isRequired,
    computeBooksInPath: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      expandedCards: []
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_handleRefetch', '_handleShowMoreDetails'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    let dialectPath = ProviderHelpers.getDialectPathFromURLArray(newProps.splitWindowPath).join('/');

    newProps.fetchDialect('/' + dialectPath);
    newProps.fetchBooksInPath('/' + dialectPath, '&currentPageIndex=' + DEFAULT_PAGE + '&pageSize=' + DEFAULT_PAGE_SIZE, { 'X-NXenrichers.document': 'ancestry', 'X-NXproperties': 'dublincore, fvbook, fvcore' });
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

  _handleRefetch(dataGridProps, page, pageSize) {
    let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 2).join('/');
    this.props.fetchBooksInPath('/' + path, '&currentPageIndex=' + page + '&pageSize=' + pageSize, { 'X-NXenrichers.document': 'ancestry', 'X-NXproperties': 'dublincore, fvbook, fvcore' });
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

    const { computeDialect, computeBooksInPath } = this.props;

    let dialect = computeDialect.response;

    let books = selectn('response.entries', computeBooksInPath) || [];

    if (computeBooksInPath.isFetching) {
      return <CircularProgress mode="indeterminate" size={5} />;
    }

    return <div>
              <div className="row">
                <div className="col-xs-8">
                </div>
                <div className={classNames('col-xs-4', 'text-right')}>
                  <RaisedButton label="New Song/Story Book" onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/create')} primary={true} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">

                  <h1>{dialect.get('dc:title')} Songs &amp; Stories</h1>

                  {books.map((tile, tileKey) => 

                    <div className="row" style={{marginBottom: '20px'}}>

                      <div className="col-xs-12">

                        <h2>{selectn('properties.fvbook:type', tile) || ''}</h2>

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

                          <CardMedia style={{display: (!selectn('properties.fv:related_pictures[0]', tile) ? 'none' : 'block')}}>
                            <img style={{minWidth: 'inherit', width: 'inherit'}} src={ConfGlobal.baseURL + 'nxfile/default/' + selectn('properties.fv:related_pictures[0]', tile) + '?inline=true'} />
                          </CardMedia>

                          <CardActions>
                            <FlatButton disabled={!selectn('properties.fvbook:introduction', tile)} label={((this.state.expandedCards.indexOf(tileKey) == -1) ? 'Show' : 'Hide') + ' Details'} onTouchTap={this._handleShowMoreDetails.bind(this, tileKey)}/>
                            <FlatButton onTouchTap={this._onNavigateRequest.bind(this, '/explore' + tile.path.replace('Stories & Songs', 'learn/stories-songs'))} primary={true} label={'View ' + (selectn('properties.fvbook:type', tile) || 'Entry')} />
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
