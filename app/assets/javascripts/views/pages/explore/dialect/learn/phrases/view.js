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

import ProviderHelpers from 'common/ProviderHelpers';

import Preview from 'views/components/Editor/Preview';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import MetadataPanel from 'views/pages/explore/dialect/learn/base/metadata-panel';
import PageToolbar from 'views/pages/explore/dialect/page-toolbar';
import SubViewTranslation from 'views/pages/explore/dialect/learn/base/subview-translation';

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
* View phrase entry
*/
@provide
export default class View extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchPhrase: PropTypes.func.isRequired,
    computePhrase: PropTypes.object.isRequired,
    deletePhrase: PropTypes.func.isRequired,
    publishPhrase: PropTypes.func.isRequired,
    unpublishPhrase: PropTypes.func.isRequired,
    enablePhrase: PropTypes.func.isRequired,
    disablePhrase: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      phrasePath: props.routeParams.dialect_path + '/Dictionary/' + props.routeParams.phrase,
      deleteDialogOpen: false
    };

    // Bind methods to 'this'
    ['_handleConfirmDelete', '_enableToggleAction', '_publishToggleAction'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchPhrase(this.state.phrasePath);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  _handleConfirmDelete(item, event) {
    this.props.deletePhrase(item.uid);
    this.setState({deleteDialogOpen: false});
  }

  /**
  * Toggle dialect (enabled/disabled)
  */
  _enableToggleAction(toggled) {

    if (toggled) {
      this.props.enablePhrase(this.state.phrasePath, null, null, "Phrase enabled!");
    } else {
      this.props.disablePhrase(this.state.phrasePath, null, null, "Phrase disabled!");
    }
  }

  /**
  * Toggle published dialect
  */
  _publishToggleAction(toggled) {
    if (toggled) {
      this.props.publishPhrase(this.state.phrasePath, null, null, "Phrase published successfully!");
    } else {
      this.props.unpublishPhrase(this.state.phrasePath, null, null, "Phrase unpublished successfully!");
    }
  }

  render() {

    const tabItemStyles = {
      userSelect: 'none'
    }

    const computeEntities = Immutable.fromJS([{
      'id': this.state.phrasePath,
      'entity': this.props.computePhrase
    }])

    const computePhrase = ProviderHelpers.getEntry(this.props.computePhrase, this.state.phrasePath);

    /**
    * Generate definitions body
    */
    return <PromiseWrapper computeEntities={computeEntities}>

            {(() => {
              if (this.props.routeParams.area == 'Workspaces') {
                
                if (selectn('response', computePhrase))
                  return <PageToolbar
                            label="Phrase"
                            handleNavigateRequest={this._onNavigateRequest}
                            computeEntity={computePhrase}
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
                      title={selectn('response.title', computePhrase)}
                      /*avatar="http://lorempixel.com/100/100/"*/ />

                    <Tabs tabItemContainerStyle={tabItemStyles}> 
                      <Tab label="Definition" > 
                        <div> 
                          <CardText>

                            <div className="col-xs-8">

                              <h2>{selectn('response.title', computePhrase)}</h2>

                              <SubViewTranslation group={selectn('response.properties.fv:definitions', computePhrase)} groupByElement="language" groupValue="translation">
                                <p>Definitions:</p>
                              </SubViewTranslation>

                              <SubViewTranslation group={selectn('response.properties.fv:literal_translation', computePhrase)} groupByElement="language" groupValue="translation">
                                <p>Literal Translations:</p>
                              </SubViewTranslation>

                            </div>

                            <div className="col-xs-4">
                              {(selectn('response', computePhrase)) ? <MetadataPanel computeEntity={computePhrase} /> : ''}
                            </div>

                          </CardText>
                        </div> 
                      </Tab> 
                      <Tab label="Photos" id="pictures"> 
                        <div> 
                          <CardText>
                            <h2>Photos</h2> 
                            <div className="row">
                              {(selectn('response.contextParameters.phrase.related_pictures', computePhrase) || []).map(function(picture, key) {
                                return <Preview key={selectn('uid', picture)} expandedValue={picture} type="FVPicture" />;
                              })}

                              {(selectn('response.contextParameters.phrase.related_pictures.length', computePhrase) === 0) ? <div className="col-xs-12">No photos are available yet.</div> : ''}
                            </div>
                          </CardText>
                        </div>
                      </Tab> 
                      <Tab label="Audio" id="audio"> 
                        <div> 
                          <CardText>
                            <h2>Audio</h2> 
                            <div className="row">
                              {(selectn('response.contextParameters.phrase.related_audio', computePhrase) || []).map(function(audio, key) {
                                return <Preview key={selectn('uid', audio)} expandedValue={audio} type="FVAudio" />;
                              })}

                              {(selectn('response.contextParameters.phrase.related_audio.length', computePhrase) === 0) ? <div className="col-xs-12">No audio is available yet.</div> : ''}
                            </div>
                          </CardText>
                        </div> 
                      </Tab> 
                      <Tab label="Video" id="video"> 
                        <div> 
                          <CardText>
                            <h2>Video</h2> 
                            <div className="row">
                              {(selectn('response.contextParameters.phrase.related_videos', computePhrase) || []).map(function(video, key) {
                                return <Preview key={selectn('uid', video)} expandedValue={video} type="FVVideo" />;
                              })}

                              {(selectn('response.contextParameters.phrase.related_videos.length', computePhrase) === 0) ? <div className="col-xs-12">No videos are available yet.</div> : ''}
                            </div>
                          </CardText>
                        </div> 
                      </Tab> 
                    </Tabs> 

                  </Card>

                  <Toolbar className="toolbar">
                    <ToolbarGroup key={0} float="right">
                      <RaisedButton onTouchTap={() => this.setState({deleteDialogOpen: true})} secondary={true} label="Delete Phrase" />
                    </ToolbarGroup>
                  </Toolbar>

                  <Dialog
                    title="Deleting phrase"
                    actions={[
                    <FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={() => this.setState({deleteDialogOpen: false})} />,
                    <FlatButton
                      label="Delete"
                      primary={true}
                      keyboardFocused={true}
                      onTouchTap={this._handleConfirmDelete.bind(this, selectn('response', computePhrase))} />]}
                    modal={false}
                    open={this.state.deleteDialogOpen}
                    onRequestClose={this._handleCancelDelete}>
                    Are you sure you would like to delete the phrase <strong>{selectn('response.title', computePhrase)}</strong>?
                  </Dialog>

                </div>
              </div>
            </div>
        </PromiseWrapper>;
  }
}