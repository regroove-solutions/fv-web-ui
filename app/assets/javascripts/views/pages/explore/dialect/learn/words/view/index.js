import React from 'react';
import _ from 'underscore';

import classNames from 'classnames';

import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

// Models
import Word from 'models/Word';
import Words from 'models/Words';

// Operations
import DocumentOperations from 'operations/DocumentOperations';
import WordOperations from 'operations/WordOperations';

/**
* View word entry
*/
export default class View extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired,
      siteProps: React.PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.wordOperations = new DocumentOperations(Word, Words, context.client, { domain: context.siteProps.domain });

    this.state = {
      word: null,
      children: null,
      picturesContent: [],
      videoContent: [],
      audioContent: []
    };

    this._fetchWord();

    this.handleTabActive = this.handleTabActive.bind(this);
  }


  // Handle change of params when navigating within router
  // See https://github.com/rackt/react-router/blob/latest/docs/guides/advanced/ComponentLifecycle.md
  componentDidUpdate (prevProps) {
    let oldWord = prevProps.params.word
    let newWord = this.props.params.word

    if (newWord !== oldWord)
      this._fetchWord();
  }

  _fetchWord() {
    this.wordOperations.getDocumentByID(this.props.params.word).then((function(word){
      this.setState({
        word: word
      });

       WordOperations.getMediaByWord(this.context.client, word).then((function(children){
          this.setState({
            children: children
          });
        }).bind(this));
    }).bind(this));
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
                WordOperations.getMediaBlobById(this.context.client, pictures[i].uid, pictures[i].properties['file:content']['mime-type']).then((function(response){
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
                WordOperations.getMediaBlobById(this.context.client, audio[i].uid, audio[i].properties['file:content']['mime-type']).then((function(response){
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

    var 
      title,
      pronunciation,
      part_of_speech,
      description,
      cultural_note,
      related_pictures,
      related_audio,
      related_videos,
      related_phrases,
      source,
      categories = "";

    var tabItemStyles = {
      userSelect: 'none'
    }

    if (this.state.word != null)
    {
      title = this.state.word.get('dc:title');
      description = this.state.word.get('dc:description');
      pronunciation = this.state.word.get('fv-word:pronunciation');
      cultural_note = this.state.word.get('fv:cultural_note');
      related_pictures = this.state.word.get('fv:related_pictures');
      related_audio = this.state.word.get('fv:related_audio');
      related_videos = this.state.word.get('fv:related_videos');
      related_phrases = this.state.word.get('fv-word:related_phrases');
      source = this.state.word.get('fv:source');
      pronunciation = this.state.word.get('fv-word:pronunciation');
      part_of_speech = this.state.word.get('fv-word:part_of_speech');
      categories = this.state.word.get('fv-word:categories');

      var defs = this.state.word.get('fv:definitions');
      var literal_translations = this.state.word.get('fv:literal_translation');
      var definitionsBody, literalTranslationBody, categoriesBody = "";

      if (defs != undefined && defs.length > 0){

          definitionsBody = "<p><strong>Definitions:</strong></p>" + "<ul>"

              defs.map(function(object, i){
                definitionsBody += '<li><strong>' + object.language + '</strong>: ' + object.translation + '</li>';
            });

          definitionsBody += "</ul>";
      }

      if (categories != undefined && categories.length > 0){

          categoriesBody = "<p><strong>Subjects:</strong></p>" + "<ul>"

              categories.map(function(object, i){
                categoriesBody += '<li style="text-transform:capitalize;">' + object + '</li>';
            });

          categoriesBody += "</ul>";
      }

      if (literal_translations != undefined && literal_translations.length > 0){

          literalTranslationBody = "<p><strong>Literal Translations:</strong></p>" + "<ul>"

              literal_translations.map(function(object, i){
                literalTranslationBody += '<li><strong>' + object.language + '</strong>: ' + object.translation + '</li>';
            });

          literalTranslationBody += "</ul>";
      }

    }

    var addMediaView;

    if (this.state.word != null && this.state.word.initialized) {
      /*addMediaView = <Dialog
      id="addMediaView" 
      ref="addMediaDialog"
      title={"Contribute Media to " + title + " Entry"}
      actions={[{ text: 'Close' }]}
      modal={this.state.modal}>
        <div className="text-left">
          <WordAddMediaView
            client={this.props.client}
            router={this.props.router} 
            word={this.state.word} />
        </div>
      </Dialog>*/
    }

    return <div>
            <div className="row">
              <div className="col-xs-12">
                <div>

                  <Card>

                    <CardHeader
                      title={title}
                      subtitle={(pronunciation!=null) ? "Pronunciation: " + pronunciation : ""}
                      avatar="http://lorempixel.com/100/100/"/>

                    <Tabs tabItemContainerStyle={tabItemStyles}> 
                      <Tab label="Definition" > 
                        <div> 
                              <CardText>

                              {addMediaView}

                              <h2>Word Entry</h2> 

                                <div>
                                  <p>{description}</p>
                                </div>

                                <div dangerouslySetInnerHTML={{__html: (part_of_speech != null) ? '<p><strong>Part of Speech</strong>: <span>' + part_of_speech + "</span></p>" : ''}} />
                                <div dangerouslySetInnerHTML={{__html: definitionsBody}} />
                                <div dangerouslySetInnerHTML={{__html: literalTranslationBody}} />
                                <div dangerouslySetInnerHTML={{__html: categoriesBody}} />

                              </CardText>
                        </div> 
                      </Tab> 
                      <Tab onActive={this.handleTabActive} label="Photos" id="pictures"> 
                        <div> 
                          <CardText>
                            <h2>Photos</h2> 
                            <div className="row">{this.state.picturesContent}</div>
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