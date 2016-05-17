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

import _ from 'underscore';

import ProviderHelpers from 'common/ProviderHelpers';

import Preview from 'views/components/Editor/Preview';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import MetadataPanel from 'views/pages/explore/dialect/learn/base/metadata-panel';
import PageToolbar from 'views/pages/explore/dialect/page-toolbar';
//import Header from 'views/pages/explore/dialect/header';
//import PageHeader from 'views/pages/explore/dialect/page-header';

import Dialog from 'material-ui/lib/dialog';

import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import Divider from 'material-ui/lib/divider';

import ListUI from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import CircularProgress from 'material-ui/lib/circular-progress';

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
    fetchWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired,
    deleteWord: PropTypes.func.isRequired,
    computeDeleteWord: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    word: PropTypes.object
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      word: null,
      wordPath: props.routeParams.dialect_path + '/Dictionary/' + props.routeParams.word,
      children: null,
      picturesContent: [],
      videoContent: [],
      audioContent: [],
      deleteDialogOpen: false
    };

    // Bind methods to 'this'
    ['_handleEditRequest', '_handleDeleteRequest', '_handleCancelDelete', '_handleConfirmDelete'].forEach( (method => this[method] = this[method].bind(this)) );

  }

  fetchData(newProps) {
    newProps.fetchWord(this.state.wordPath);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  _handleEditRequest(item, event) {
    // Get path name from path
    let splitPath = item.path.split('/');
    let wordName = splitPath[splitPath.length - 1];

    this._onNavigateRequest(this.props.windowPath.replace(wordName, 'edit/' + wordName));
  }

  _handleDeleteRequest() {
    this.setState({deleteDialogOpen: true});
  }

  _handleConfirmDelete(item, event) {
    this.props.deleteWord(item.uid);
    this.setState({deleteDialogOpen: false});
  }

  _handleCancelDelete() {
    this.setState({deleteDialogOpen: false});
  }

  /**
  * Toggle dialect (enabled/disabled)
  */
  _enableToggleAction(toggled) {
    if (toggled) {
      this.props.enableDocument(this.props.routeParams.dialect_path);
    } else {
      this.props.disableDocument(this.props.routeParams.dialect_path);
    }
  }

  /**
  * Toggle published dialect
  */
  _publishToggleAction(toggled) {
    if (toggled) {
      this.props.publishDialect('524bccd5-6b3e-459b-90b1-ebf0bca7fb55');
    } else {
      this.props.unpublishDialect(this.props.routeParams.dialect_path);
    }
  }

  render() {

    const tabItemStyles = {
      userSelect: 'none'
    }

    const computeEntities = Immutable.fromJS([{
      'id': this.state.wordPath,
      'entity': this.props.computeWord
    }])

    const computeWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath);

    /**
    * Generate definitions body
    */
    return <PromiseWrapper computeEntities={computeEntities}>

            {(() => {
              if (this.props.routeParams.area == 'Workspaces') {
                
                if (selectn('response', computeWord))
                  return <PageToolbar
                            label="Word"
                            handleNavigateRequest={this._onNavigateRequest}
                            computeEntity={computeWord}
                            publishToggleAction={this._publishToggleAction}
                            enableToggleAction={this._enableToggleAction}
                            {...this.props} />;
              }
            })()}

            <div className="row">
              <div className="col-xs-12">
                <div>

                  <Card>
                    <CardHeader
                      title={selectn('response.title', computeWord)}
                      subtitle={(selectn('response.contextParameters.word.part_of_speech', computeWord) !=null) ? "Part of Speech: " + selectn('response.contextParameters.word.part_of_speech', computeWord) : ""}
                      /*avatar="http://lorempixel.com/100/100/"*/ />

                    <Tabs tabItemContainerStyle={tabItemStyles}> 
                      <Tab label="Definition" > 
                        <div> 
                          <CardText>

                            <div className="col-xs-8">

                              <h2>{selectn('response.title', computeWord)}</h2>

                              <p>Part of Speech: {selectn('response.contextParameters.word.part_of_speech', computeWord)}</p>

                              <p>Pronunciation: {selectn('response.properties.fv-word:pronunciation', computeWord)}</p>

                              <SubView group={selectn('response.properties.fv:definitions', computeWord)} groupByElement="language" groupValue="translation">
                                <p>Definitions:</p>
                              </SubView>

                              <SubView group={selectn('response.properties.fv:literal_translation', computeWord)} groupByElement="language" groupValue="translation">
                                <p>Literal Translations:</p>
                              </SubView>


                              <h3>Related Phrases:</h3>

                              {(selectn('response.contextParameters.word.related_phrases', computeWord) || []).map(function(phrase, key) {
                                let phraseItem = selectn('fv:definitions', phrase);
                                
                                return (
                                <SubView key={key} group={phraseItem} groupByElement="language" groupValue="translation">
                                  <p>{selectn('dc:title', phrase)}</p>
                                </SubView>
                                );
                              })}

                            </div>

                            <div className="col-xs-4">
                              {(selectn('response', computeWord)) ? <MetadataPanel computeEntity={computeWord} /> : ''}
                            </div>

                          </CardText>
                        </div> 
                      </Tab> 
                      <Tab label="Photos" id="pictures"> 
                        <div> 
                          <CardText>
                            <h2>Photos</h2> 
                            <div className="row">
                              {(selectn('response.contextParameters.word.related_pictures', computeWord) || []).map(function(picture, key) {
                                return <Preview key={selectn('uid', picture)} expandedValue={picture} type="FVPicture" />;
                              })}

                              {(selectn('response.contextParameters.word.related_pictures.length', computeWord) === 0) ? <div className="col-xs-12">No photos are available yet.</div> : ''}
                            </div>
                          </CardText>
                        </div>
                      </Tab> 
                      <Tab label="Audio" id="audio"> 
                        <div> 
                          <CardText>
                            <h2>Audio</h2> 
                            <div className="row">
                              {(selectn('response.contextParameters.word.related_audio', computeWord) || []).map(function(audio, key) {
                                return <Preview key={selectn('uid', audio)} expandedValue={audio} type="FVAudio" />;
                              })}

                              {(selectn('response.contextParameters.word.related_audio.length', computeWord) === 0) ? <div className="col-xs-12">No audio is available yet.</div> : ''}
                            </div>
                          </CardText>
                        </div> 
                      </Tab> 
                      <Tab label="Video" id="video"> 
                        <div> 
                          <CardText>
                            <h2>Video</h2> 
                            <div className="row">
                              {(selectn('response.contextParameters.word.related_videos', computeWord) || []).map(function(video, key) {
                                return <Preview key={selectn('uid', video)} expandedValue={video} type="FVVideo" />;
                              })}

                              {(selectn('response.contextParameters.word.related_videos.length', computeWord) === 0) ? <div className="col-xs-12">No videos are available yet.</div> : ''}
                            </div>
                          </CardText>
                        </div> 
                      </Tab> 
                    </Tabs> 

                  </Card>

                  <Toolbar className="toolbar">
                    <ToolbarGroup key={0} float="right">
                      <RaisedButton onTouchTap={this._handleEditRequest.bind(this, selectn('response', computeWord))} secondary={true} label="Edit" />
                      <RaisedButton onTouchTap={this._handleDeleteRequest} secondary={true} label="Delete" />
                    </ToolbarGroup>
                  </Toolbar>

                  <Dialog
                    title="Deleting word"
                    actions={[
                    <FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={this._handleCancelDelete} />,
                    <FlatButton
                      label="Delete"
                      primary={true}
                      keyboardFocused={true}
                      onTouchTap={this._handleConfirmDelete.bind(this, selectn('response', computeWord))} />]}
                    modal={false}
                    open={this.state.deleteDialogOpen}
                    onRequestClose={this._handleCancelDelete}>
                    Are you sure you would like to delete the word <strong>{selectn('response.title', computeWord)}</strong>?
                  </Dialog>

                </div>
              </div>
            </div>
        </PromiseWrapper>;
  }
}

class SubView extends Component {

  static containerStyles = {
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: '#efefef',
    margin: '10px 0',
    padding: '10px'
  };

  static tabsStyles = {
    tabItemContainerStyle: {
      backgroundColor: 'transparent'
    }
  };

  static tabStyles = {
    headline: {
      fontSize: 12,
      color: '#000',
      paddingTop: 2,
      paddingBottom: 2,
      marginBottom: 5,
      textAlign: 'left'
    }
  };

  constructor(props, context){
    super(props, context);
  }

  render() {

    const _this = this;

    const grouped = _.groupBy(this.props.group, function(obj) {
      return obj[_this.props.groupByElement];
    });

    if ( !grouped || _.isEmpty(grouped) )
      return <div></div>;

    return <div style={SubView.containerStyles}>
      
      <h3>{this.props.children}</h3>

      <Tabs tabItemContainerStyle={SubView.tabsStyles.tabItemContainerStyle}>
      {_.map(grouped, function(group, key) {

        return <Tab style={SubView.tabStyles.headline} label={key} key={key}>

        <ListUI>

          {group.map(function(groupValue, key) {
            return (<ListItem key={key} primaryText={groupValue[_this.props.groupValue]} />);
          })}

        </ListUI>

        </Tab>;

      })}
      </Tabs>
    </div>;
  }
}
