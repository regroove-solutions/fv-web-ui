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
    word: PropTypes.object
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      word: null,
      wordPath: null,
      children: null,
      picturesContent: [],
      videoContent: [],
      audioContent: []
    };

    this.handleTabActive = this.handleTabActive.bind(this);
  }

  fetchData(newProps) {

    let dialectPath = ProviderHelpers.getDialectPathFromURLArray(newProps.splitWindowPath).join('/');
    let wordPath = '/' + dialectPath + '/Dictionary/' + newProps.splitWindowPath[newProps.splitWindowPath.length - 1];

    this.setState({
      wordPath: wordPath
    });

    newProps.fetchWord(wordPath);
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  handleTabActive(tab) {

    if (this.state.children != undefined && this.state.children.length > 0) {
      switch(tab.props.id) {
        case 'pictures':
          if (this.state.picturesContent.length == 0) {
            var pictures = _.filter(this.state.children, function(child){ if (child.type == 'FVPicture') return child; })

            if (pictures != undefined && pictures.length > 0) {
              var tmpArray = [];

              this.setState({picturesContent: <div className={classNames('alert', 'alert-info', 'text-center')} role="alert">Loading...</div>});

              for (var i=0; i < pictures.length; i++) {
                this.wordOperations.getMediaBlobById(pictures[i].uid, pictures[i].properties['file:content']['mime-type']).then((function(response){
                  tmpArray.push(<div key={response.mediaId} className="col-xs-12">
                    <img className="image" src={response.dataUri} alt=""/>
                   </div>);

                  this.setState({picturesContent: tmpArray});

                }).bind(this));
              }
            }
            else {
              this.setState({picturesContent: <div className={classNames('alert', 'alert-warning', 'text-center')} role="alert">No photos are available. Please add some!</div>});
            }
          }
        break;

        case 'audio':
          if (this.state.audioContent.length == 0) {
            var audio = _.filter(this.state.children, function(child){ if (child.type == 'FVAudio') return child; })

            if (audio != undefined && audio.length > 0) {
              var tmpArray = [];

              this.setState({audioContent: <div className={classNames('alert', 'alert-info', 'text-center')} role="alert">Loading...</div>});
              for (var i =0; i < audio.length; i++) {
                this.wordOperations.getMediaBlobById(audio[i].uid, audio[i].properties['file:content']['mime-type']).then((function(response){
                  tmpArray.push(<audio key={response.mediaId} src={response.dataUri} preload="auto" controls="controls">Your browser does not support the audio element.</audio>);
                  this.setState({audioContent: tmpArray});
                }).bind(this));
              }
            }
            else {
              this.setState({audioContent: <div className={classNames('alert', 'alert-warning', 'text-center')} role="alert">No audio clips are available. Please add some!</div>});
            }
          }
        break;

        // TODO: http://stackoverflow.com/questions/16761927/aw-snap-when-data-uri-is-too-large
        case 'video':
          if (this.state.videoContent.length == 0) {
            var video = _.filter(this.state.children, function(child){ if (child.type == 'FVVideo') return child; })

            if (video != undefined && video.length > 0) {
              var tmpArray = [];

              this.setState({videoContent: <div className={classNames('alert', 'alert-info', 'text-center')} role="alert">Loading...</div>});
              for (var i =0; i < video.length; i++) {

              tmpArray.push(
                  <video key="video" width="100%" height="auto" controls>
                    <source src={video[i].properties['vid:transcodedVideos'][0].content.data} type="video/webm"/>
                    <source src={video[i].properties['file:content'].data} type="video/mp4"/>
                  </video>);

              this.setState({videoContent: tmpArray});

              }
            }
            else {
              this.setState({videoContent: <div className={classNames('alert', 'alert-warning', 'text-center')} role="alert">No videos are available. Please add some!</div>});
            }
          }
        break;
      }
    }
  }

  render() {

    const { computeWord } = this.props;

    let word = ProviderHelpers.getEntry(computeWord, this.state.wordPath);
    let wordResponse = selectn('response', word);

    var tabItemStyles = {
      userSelect: 'none'
    }

    if (!wordResponse || !word || !word.success) {
      return <CircularProgress mode="indeterminate" size={5} />;
    }

    /**
    * Generate definitions body
    */
    return <div>
            <div className="row">
              <div className="col-xs-12">
                <div>

                  <Card>
                    <CardHeader
                      title={selectn('title', wordResponse)}
                      subtitle={(selectn('contextParameters.word.part_of_speech', wordResponse) !=null) ? "Part of Speech: " + selectn('contextParameters.word.part_of_speech', wordResponse) : ""}
                      avatar="http://lorempixel.com/100/100/"/>

                    <Tabs tabItemContainerStyle={tabItemStyles}> 
                      <Tab label="Definition" > 
                        <div> 
                          <CardText>

                            <div className="col-xs-8">

                              <h2>{selectn('title', wordResponse)}</h2>

                              <p>Part of Speech: {selectn('contextParameters.word.part_of_speech', wordResponse)}</p>

                              <p>Pronunciation: {selectn('properties.fv-word:pronunciation', wordResponse)}</p>

                              <SubView group={selectn('properties.fv:definitions', wordResponse)} groupByElement="language" groupValue="translation">
                                <p>Definitions:</p>
                              </SubView>

                              <SubView group={selectn('properties.fv:literal_translation', wordResponse)} groupByElement="language" groupValue="translation">
                                <p>Literal Translations:</p>
                              </SubView>


                              <h3>Related Phrases:</h3>

                              {(selectn('contextParameters.word.related_phrases', wordResponse) || []).map(function(phrase, key) {
                                let phraseItem = selectn('fv:literal_translation', phrase);
                                
                                return (
                                <SubView key={key} group={phraseItem} groupByElement="language" groupValue="translation">
                                  <p>{selectn('dc:title', phrase)}</p>
                                </SubView>
                                );
                              })}

                            </div>

                            <div className="col-xs-4">
                              <p>
                                Categories: {(selectn('contextParameters.word.categories', wordResponse) || []).map(function(category, key) {
                                  return (selectn('dc:title', category));
                                })}
                              </p>
                              <Divider />
                              <p>Cultural Note: {selectn('properties.fv-word:cultural_note', wordResponse)}</p>
                              <Divider />
                              <p>Reference: {selectn('properties.fv-word:reference', wordResponse)}</p>
                              <Divider />
                              <p>
                                Sources: {(selectn('contextParameters.word.sources', wordResponse) || []).map(function(source, key) {
                                  return (selectn('dc:title', source));
                                })}
                              </p>
                            </div>

                          </CardText>
                        </div> 
                      </Tab> 
                      <Tab onActive={this.handleTabActive} label="Photos" id="pictures"> 
                        <div> 
                          <CardText>
                            <h2>Photos</h2> 
                            <div className="row">
                              {(selectn('properties.related_pictures', wordResponse) || []).map(function(picture, key) {
                                return (picture);
                              })}
                            </div>
                          </CardText>
                        </div>
                      </Tab> 
                      <Tab label="Audio" onActive={this.handleTabActive} id="audio"> 
                        <div> 
                          <CardText>
                            <h2>Audio</h2> 
                            <div className="row">{this.state.audioContent}</div>
                          </CardText>
                        </div> 
                      </Tab> 
                      <Tab label="Video" onActive={this.handleTabActive} id="video"> 
                        <div> 
                          <CardText>
                            <h2>Video</h2> 
                            <div className="row">{this.state.videoContent}</div>
                          </CardText>
                        </div> 
                      </Tab> 
                    </Tabs> 

                  </Card>

                  <Toolbar className="toolbar">
                    <ToolbarGroup key={0} float="right">
                      <FontIcon className={classNames('glyphicon', 'glyphicon-pencil')} onTouchTap={this.handleEditTouchTap} />
                      <ToolbarSeparator/>
                      <RaisedButton onTouchTap={this.handleAddMedia} label="Add Media" primary={true} />
                    </ToolbarGroup>
                  </Toolbar>

                </div>
              </div>
            </div>
        </div>;
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
