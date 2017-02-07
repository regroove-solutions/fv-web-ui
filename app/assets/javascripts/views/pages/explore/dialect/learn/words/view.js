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

import ProviderHelpers from 'common/ProviderHelpers';

import Preview from 'views/components/Editor/Preview';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import MetadataPanel from 'views/pages/explore/dialect/learn/base/metadata-panel';
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel';
import PageToolbar from 'views/pages/explore/dialect/page-toolbar';
import SubViewTranslation from 'views/pages/explore/dialect/learn/base/subview-translation';

import {Link} from 'provide-page';

//import Header from 'views/pages/explore/dialect/header';
//import PageHeader from 'views/pages/explore/dialect/page-header';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

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

import '!style-loader!css-loader!react-image-gallery/build/image-gallery.css';

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
    computeLogin: PropTypes.object.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    fetchWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired,
    deleteWord: PropTypes.func.isRequired,
    computeDeleteWord: PropTypes.object.isRequired,
    publishWord: PropTypes.func.isRequired,
    askToPublishWord: PropTypes.func.isRequired,
    unpublishWord: PropTypes.func.isRequired,
    askToUnpublishWord: PropTypes.func.isRequired,
    enableWord: PropTypes.func.isRequired,
    askToEnableWord: PropTypes.func.isRequired,
    disableWord: PropTypes.func.isRequired,
    askToDisableWord: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      deleteDialogOpen: false
    };

    // Bind methods to 'this'
    ['_handleConfirmDelete', '_enableToggleAction', '_publishToggleAction', '_onNavigateRequest', '_publishChangesAction'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchWord(this._getWordPath(newProps));
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {

    if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      this.fetchData(nextProps);
    }
    else if (nextProps.routeParams.word !== this.props.routeParams.word) {
      this.fetchData(nextProps);
    }
    else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
      this.fetchData(nextProps);
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  _getWordPath(props = null) {

    if (props == null) {
      props = this.props;
    }

    return props.routeParams.dialect_path + '/Dictionary/' + props.routeParams.word;
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  _handleConfirmDelete(item, event) {
    this.props.deleteWord(item.uid);
    this.setState({deleteDialogOpen: false});
  }

  /**
  * Toggle dialect (enabled/disabled)
  */
  _enableToggleAction(toggled, workflow) {
    if (toggled) {
      if (workflow) {
        this.props.askToEnableWord(this._getWordPath(), {id: "FVEnableLanguageAsset", start: "true"}, null, "Request to enable word successfully submitted!", null);
      }
      else {
        this.props.enableWord(this._getWordPath(), null, null, "Word enabled!");
      }
    } else {
      if (workflow) {
        this.props.askToDisableWord(this._getWordPath(), {id: "FVDisableLanguageAsset", start: "true"}, null, "Request to disable word successfully submitted!", null);
      }
      else {
        this.props.disableWord(this._getWordPath(), null, null, "Word disabled!");
      }
    }
  }

  /**
  * Toggle published dialect
  */
  _publishToggleAction(toggled, workflow) {
    if (toggled) {
      if (workflow) {
        this.props.askToPublishWord(this._getWordPath(), {id: "FVPublishLanguageAsset", start: "true"}, null, "Request to publish word successfully submitted!", null);
      }
      else {
        this.props.publishWord(this._getWordPath(), null, null, "Word published successfully!");
      }
    } else {
      if (workflow) {
        this.props.askToUnpublishWord(this._getWordPath(), {id: "FVUnpublishLanguageAsset", start: "true"}, null, "Request to unpublish word successfully submitted!", null);
      }
      else {
        this.props.unpublishWord(this._getWordPath(), null, null, "Word unpublished successfully!");
      }
    }
  }

  /**
  * Publish changes
  */
  _publishChangesAction() {
    this.props.publishWord(this._getWordPath(), null, null, "Word published successfully!");
  } 

  render() {

    const tabItemStyles = {
      userSelect: 'none'
    }

    const computeEntities = Immutable.fromJS([{
      'id': this._getWordPath(),
      'entity': this.props.computeWord
    },{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }])

    const computeWord = ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath());
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    // Generate photos
    let photos = [];

    (selectn('response.contextParameters.word.related_pictures', computeWord) || []).map(function(picture, key) {
      let image = { original: ConfGlobal.baseURL + picture.path, thumbnail: ConfGlobal.baseURL + picture.path, description: picture['dc:description'], key: key, id: picture.uid, object: picture };
      photos.push(image);
    })

    // Generate videos
    let videos = [];

    (selectn('response.contextParameters.word.related_videos', computeWord) || []).map(function(video, key) {
      let vid = { original: ConfGlobal.baseURL + video.path, thumbnail: ConfGlobal.baseURL + video.path, description: video['dc:description'], key: key, id: video.uid, object: video };
      videos.push(vid);
    })

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
                            computePermissionEntity={computeDialect2}
                            computeLogin={this.props.computeLogin}
                            publishToggleAction={this._publishToggleAction}
                            publishChangesAction={this._publishChangesAction}
                            enableToggleAction={this._enableToggleAction}
                            {...this.props}></PageToolbar>;
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

                              <h3>Audio</h3>

                              <div>

                                {(selectn('response.contextParameters.word.related_audio.length', computeWord) === 0) ? <span>No audio is available yet.</span> : ''}

                                {(selectn('response.contextParameters.word.related_audio', computeWord) || []).map(function(audio, key) {
                                  return <Preview styles={{maxWidth: '350px'}} key={selectn('uid', audio)} expandedValue={audio} type="FVAudio" />;
                                })}

                              </div>

                              <SubViewTranslation group={selectn('response.properties.fv:definitions', computeWord)} groupByElement="language" groupValue="translation">
                                <p>Definitions:</p>
                              </SubViewTranslation>

                              <SubViewTranslation group={selectn('response.properties.fv:literal_translation', computeWord)} groupByElement="language" groupValue="translation">
                                <p>Literal Translations:</p>
                              </SubViewTranslation>

                              {(() => {
                                  if (selectn('response.contextParameters.word.related_phrases.length', computeWord)) {
                                    return <div>
                                      <h3>Related Phrases:</h3>

                                      {(selectn('response.contextParameters.word.related_phrases', computeWord) || []).map(function(phrase, key) {
                                        let phraseItem = selectn('fv:definitions', phrase);

                                        return (
                                        <SubViewTranslation key={key} group={phraseItem} groupByElement="language" groupValue="translation">
                                          <p><Link key={selectn('uid', phrase)} href={'/explore' + selectn('path', phrase).replace('Dictionary', 'learn/phrases')}>{selectn('dc:title', phrase)}</Link></p>
                                        </SubViewTranslation>
                                        );
                                      })}
                                    </div>;
                                  }
                              })()}

                            </div>

                            <div className="col-xs-4">

                              <MediaPanel label="Photo(s)" type="FVPicture" items={photos} />
                              <MediaPanel label="Video(s)" type="FVVideo" items={videos} />

                            </div>

                          </CardText>
                        </div>
                      </Tab>
                      <Tab label="Metadata" id="metadata">
                        <div>
                          <CardText>
                            <h2>Metadata</h2>
                            <div className="row">
                              {(selectn('response', computeWord)) ? <MetadataPanel computeEntity={computeWord} /> : ''}
                            </div>
                          </CardText>
                        </div>
                      </Tab>
                    </Tabs>

                  </Card>

                  <AuthorizationFilter filter={{permission: 'Delete', entity: selectn('response', computeWord)}}>
                    <Toolbar className="toolbar">
                      <ToolbarGroup key={0} float="right">
                        <RaisedButton onTouchTap={() => this.setState({deleteDialogOpen: true})} secondary={true} label="Delete Word" />
                      </ToolbarGroup>
                    </Toolbar>

                    <Dialog
                      title="Deleting word"
                      actions={[
                      <FlatButton
                      label="Cancel"
                      secondary={true}
                      onTouchTap={() => this.setState({deleteDialogOpen: false})} />,
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
                  </AuthorizationFilter>

                </div>
              </div>
            </div>
        </PromiseWrapper>;
  }
}