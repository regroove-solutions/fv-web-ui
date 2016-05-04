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

import _ from 'underscore';

import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import Paper from 'material-ui/lib/paper';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import Divider from 'material-ui/lib/divider';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import CircularProgress from 'material-ui/lib/circular-progress';

const DEFAULT_LANGUAGE = 'english';

/**
* View word entry
*/
@provide
export default class View extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchBook: PropTypes.func.isRequired,
    computeBook: PropTypes.object.isRequired,
    fetchBookEntriesInPath: PropTypes.func.isRequired,
    computeBookEntriesInPath: PropTypes.object.isRequired,
    book: PropTypes.object
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      book: null,
      bookPath: null,
      children: null
    };

    // Bind methods to 'this'
    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {

    let dialectPath = ProviderHelpers.getDialectPathFromURLArray(newProps.splitWindowPath);
    let entryPath = '/' + dialectPath + '/Stories & Songs/' + newProps.splitWindowPath[newProps.splitWindowPath.length - 1];

    this.setState({
      bookPath: entryPath
    });

    newProps.fetchBook('/' + entryPath);
    newProps.fetchBookEntriesInPath('/' + entryPath, ' ORDER BY fvbookentry:sort_map');
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  render() {

    const { computeBook, computeBookEntriesInPath } = this.props;

    let book = selectn('books[/' + this.state.bookPath + ']', computeBook);
    
    let bookResponse = selectn('response', book);
    let bookEntriesResponse = selectn('response', computeBookEntriesInPath);

    if (!book || !book.success || !computeBookEntriesInPath || !computeBookEntriesInPath.success) {
      return <CircularProgress mode="indeterminate" size={5} />;
    }

    let pages = selectn('entries', bookEntriesResponse) || [];

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

                  <h1>{selectn('title', bookResponse)}</h1>

                  {pages.map((tile, tileKey) => 

                    <div className="row" style={{marginBottom: '20px'}}>

                      <div className="col-xs-12">

                      	<Paper style={{padding: '15px', margin: '20px 0'}} zDepth={2}>

		                    <div className="row" style={{marginBottom: '20px'}}>

		                      <div className="col-xs-2">
		                      	{(() => {
		                      		return (selectn('properties.fv:related_pictures[0]', tile)) ? <img className="pull-left" style={{maxWidth: '300px', width: 'auto'}} src={ConfGlobal.baseURL + 'nxfile/default/' + selectn('properties.fv:related_pictures[0]', tile) + '?inline=true'} /> : ''
		                      	})()}
		                      </div>

		                      <div className="col-xs-10">
		                      	<p>
		                      		
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
        </div>;
  }
}
