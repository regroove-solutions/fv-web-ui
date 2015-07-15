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

   this.state = {
      word: null,
      children: null
   };


   WordOperations.getWordById(props.client, props.id).then((function(word){
      this.setState({
        word: word
      });
   }).bind(this));

   WordOperations.getMediaByWord(props.client, props.id).then((function(children){
      this.setState({
        children: children
      });
    }).bind(this));
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

    var title, pronunciation, part_of_speech, description = "";

    if (this.state.word != null)
    {
      title = this.state.word.get('dc:title');
      description = this.state.word.get('dc:description');
      pronunciation = this.state.word.get('fv:pronunciation');
      part_of_speech = this.state.word.get('fv:part_of_speech');

      var defs = this.state.word.get('fv:definitions');
      var definitionsBody, subjectsBody, picturesBody = "";

      if (defs != undefined && defs.length > 0){

          definitionsBody = "<p><strong>Definitions:</strong></p>" + "<ul>"

              defs.map(function(object, i){
                definitionsBody += '<li>' + object + '</li>';
            });

          definitionsBody += "</ul>";
      }

      var subjects = this.state.word.get('dc:subjects');

      if (subjects != undefined && subjects.length > 0){

          subjectsBody = "<p><strong>Subjects:</strong></p>" + "<ul>"

              subjects.map(function(object, i){
                subjectsBody += '<li style="text-transform:capitalize;">' + object + '</li>';
            });

          subjectsBody += "</ul>";
      }

    }

    if (this.state.children != undefined && this.state.children.length > 0) {
      var pictures = _.filter(this.state.children, function(child){ if (child.type == 'Picture') return child; })
      var audio = _.filter(this.state.children, function(child){ if (child.type == 'Audio') return child; })
      var video = _.filter(this.state.children, function(child){ if (child.type == 'Video') return child; })
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

    var picturesContent = [];
    var audioContent = [];
    var videoContent = [];

    if (pictures != undefined && pictures.length > 0) {

      for (var i =0; i < pictures.length; i++) {

      picturesContent.push(<div className="col-xs-12">
        <img className="image" src={(pictures != undefined && pictures[i].properties['picture:views'][2].content.data != "") ? pictures[i].properties['picture:views'][2].content.data : ''} alt=""/>
       </div>);
      }
    }

    if (audio != undefined && audio.length > 0) {

      for (var i =0; i < pictures.length; i++) {

      audioContent.push(<audio src={(audio != undefined && audio.length > 0) ? audio[i].properties['file:content'].data : ''} preload="auto" controls="controls">
    Your browser does not support the audio element.
    </audio>);
      }
    }

    if (video != undefined && video.length > 0) {

      for (var i =0; i < pictures.length; i++) {
      videoContent.push(<video width="100%" height="auto" controls src={(video != undefined && video.length > 0) ? video[0].properties['file:content'].data : ''} type={(video != undefined && video.length > 0) ? video[0].properties['file:content']['mime-type'] : ''}>
    Your browser does not support the video tag.
    </video>);
      }
    }

    return (
      <div>

        <Card>

          <CardHeader
            title={title}
            subtitle={(pronunciation!=null) ? "Pronunciation: " + pronunciation : ""}
            avatar="http://lorempixel.com/100/100/"/>

          <Tabs> 
            <Tab label="Definition" > 
              <div> 
                    <CardText>

                    {addMediaView}

                    <h2>Definition</h2> 

                      <div>
                        <p>{description}</p>
                      </div>

                      <div dangerouslySetInnerHTML={{__html: (part_of_speech != null) ? '<p><strong>Part of Speech</strong>: <span style="text-transform:capitalize;">' + part_of_speech + "</span></p>" : ''}} />
                      <div dangerouslySetInnerHTML={{__html: definitionsBody}} />
                      <div dangerouslySetInnerHTML={{__html: subjectsBody}} />

                    </CardText>
              </div> 
            </Tab> 
            <Tab label="Photos" > 
              <div> 
                <CardText>
                <h2>Photos</h2> 
                <div dangerouslySetInnerHTML={{__html: picturesBody}} />
                <div className="row">{picturesContent}</div>
                </CardText>
              </div> 
            </Tab> 
            <Tab label="Audio" > 
              <div> 
                <CardText>
                <h2>Audio</h2> 
                <div dangerouslySetInnerHTML={{__html: picturesBody}} />
                <div className="row">{audioContent}</div>

                </CardText>
              </div> 
            </Tab> 
            <Tab label="Video" > 
              <div> 
                <CardText>
                <h2>Video</h2> 
                <div dangerouslySetInnerHTML={{__html: picturesBody}} />
                <div className="row">{videoContent}</div>
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