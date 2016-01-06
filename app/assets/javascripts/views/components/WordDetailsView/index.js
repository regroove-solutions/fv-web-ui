var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');
var Mui = require('material-ui');
var {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } = Mui;

var WordAddMediaView = require('../WordAddMediaView');

var WordOperations = require('../../../operations/WordOperations');

var Word = require('models/Word');

class WordDetailsView extends React.Component {

  constructor(props) {
    super(props);

   this.handleEditTouchTap = this.handleEditTouchTap.bind(this);
   this.handleAddMedia = this.handleAddMedia.bind(this);
   this.handleChange = this.handleChange.bind(this);
   this.handleTabActive = this.handleTabActive.bind(this);

   this.state = {
      word: null,
      children: null,
      picturesContent: [],
      videoContent: [],
      audioContent: []
   };

   WordOperations.getWordById(props.client, props.id).then((function(word){
      this.setState({
        word: word
      });

       WordOperations.getMediaByWord(props.client, word).then((function(children){
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
                WordOperations.getMediaBlobById(this.props.client, pictures[i].uid, pictures[i].properties['file:content']['mime-type']).then((function(response){
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
                WordOperations.getMediaBlobById(this.props.client, audio[i].uid, audio[i].properties['file:content']['mime-type']).then((function(response){
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


/****
***
**
Experiment to by pass large data-uri issues in chrome android
Test also WebM format


var FILE = 'http://ec2-50-112-240-83.us-west-2.compute.amazonaws.com/nuxeo/site/automation/Blob.Get';
var NUM_CHUNKS = 5;


window.MediaSource = window.MediaSource || window.WebKitMediaSource;
if (!!!window.MediaSource) {
  alert('MediaSource API is not available');
}

var mediaSource = new MediaSource();

tmpArray.push(<video id="helloworld" key="helloworld" width="100%" height="auto" controls src={window.URL.createObjectURL(mediaSource)}>Your browser does not support the video tag.</video>);
this.setState({videoContent: tmpArray});


//http://stackoverflow.com/questions/22157623/h264-video-works-using-src-attribute-same-video-fails-using-the-mediasource-api
function callback(e) {

var videoObj = document.getElementById('helloworld');


  var sourceBuffer = mediaSource.addSourceBuffer('video/mp4;codecs=avc1.4d0020,mp4a.40.2');

  GET(FILE, function(uInt8Array) {
    var file = new Blob([uInt8Array], {type: 'video/mp4'});
    var chunkSize = Math.ceil(file.size / NUM_CHUNKS);

    // Slice the video into NUM_CHUNKS and append each to the media element.
    var i = 0;

    (function readChunk_(i) {
      var reader = new FileReader();

      // Reads aren't guaranteed to finish in the same order they're started in,
      // so we need to read + append the next chunk after the previous reader
      // is done (onload is fired).
      reader.onload = function(e) {
        sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
        if (i == NUM_CHUNKS - 1) {
          mediaSource.endOfStream();
        } else {
          if (videoObj.paused) {
            videoObj.play(); // Start playing after 1st chunk is appended.
          }
          readChunk_(++i);
        }
      };

      var startByte = chunkSize * i;
      var chunk = file.slice(startByte, startByte + chunkSize);

      reader.readAsArrayBuffer(chunk);
    })(i);  // Start the recursive call by self calling.
  });
}

mediaSource.addEventListener('sourceopen', callback, false);
mediaSource.addEventListener('webkitsourceopen', callback, false);

mediaSource.addEventListener('webkitsourceended', function(e) {
//mdeiaready
}, false);

function GET(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.responseType = 'arraybuffer';

xhr.setRequestHeader("authorization", "Basic d2ViYXBwOjB2dldYMDlwNngwYTgzUw==");
xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({input: 'cdcdb2ea-9a66-4969-9a31-d38f7477e1e6', xpath: 'file:content'}));

  xhr.onload = function(e) {
    if (xhr.status != 200) {
      alert("Unexpected status code " + xhr.status + " for " + url);
      return false;
    }
    callback(new Uint8Array(xhr.response));
  };
}
****/

              tmpArray.push(
                  <video key="video" width="100%" height="auto" controls>
                    <source src={video[i].properties['vid:transcodedVideos'][0].content.data} type="video/webm"/>
                    <source src={video[i].properties['file:content'].data} type="video/mp4"/>
                  </video>);

              this.setState({videoContent: tmpArray});

              /*WordOperations.getMediaBlobById(this.props.client, video[i].uid, video[i].properties['file:content']['mime-type']).then((function(response){
                  tmpArray.push(<video key={response.mediaId} width="100%" height="auto" controls src={response.dataUri} type={(video != undefined && video.length > 0) ? video[0].properties['file:content']['mime-type'] : ''}>Your browser does not support the video tag.</video>);
                  this.setState({videoContent: tmpArray});
                }).bind(this));
              */
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

  handleEditTouchTap() {
    this.props.router.navigate("contribute/edit/" + this.state.word.get('id') , {trigger: true});
  }

  handleAddMedia() {
    this.refs.addMediaDialog.show();
  }

  handleChange(field) {
    //this.refs.editDialog.show();
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
      addMediaView = <Dialog
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
      </Dialog>
    }

    return (
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
    );
  }
}

WordDetailsView.contextTypes = {
  router: React.PropTypes.func
};

module.exports = WordDetailsView;