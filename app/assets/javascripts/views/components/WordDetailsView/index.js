var React = require('react');
var Underscore = require('underscore');
var classNames = require('classnames');
var Mui = require('material-ui');
var {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } = Mui;

var {Colors, Spacing, Typography} = Mui.Styles;

var WordEditView = require('../WordEditView');
var WordAddMediaView = require('../WordAddMediaView');

var Word = require('models/Word');


//var DataGrid = require('react-datagrid');

//require('!style!css!react-datagrid/dist/index.min.css');


var _ = Underscore;

var currentWord;
var {Colors, Spacing, Typography} = Mui.Styles;

function getData(client, word){

  //var _this = this;

  return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          client.operation('Document.Query')
            .params({
              query: "SELECT * FROM Document WHERE (ecm:uuid = '" + word + "' AND ecm:primaryType = 'Word')"
            })
          .execute(function(error, response) {

                // Handle error
            if (error) {
              throw error;
            }

            if (response.entries.length > 0) {
            	response.entries[0].client = client;
                currentWord = new Word(response.entries[0]);
                //currentWord.setClient(client);
                resolve(currentWord);
            } else {
              reject('Workspace not found');
            }

          });

        });
}

function getChildren(client, word){

  //var _this = this;

  return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {


          client.operation('Document.Query')
            .params({
              query: "SELECT * FROM Document WHERE (ecm:parentId = '" + word + "' AND ecm:currentLifeCycleState <> 'deleted' AND (ecm:primaryType = 'Audio' OR ecm:primaryType = 'Video' OR ecm:primaryType = 'Picture'))"
            })
          .execute(function(error, response) {

                // Handle error
            if (error) {
              throw error;
            }

            if (response.entries.length > 0) {
              resolve(response.entries);
            } else {
              reject('Workspace not found');
            }

          });
        });
}

class WordDetailsView extends React.Component {

  constructor(props) {
    super(props);

        this.handleStandardDialogTouchTap = this.handleStandardDialogTouchTap.bind(this);
        this.handleEditTouchTap = this.handleEditTouchTap.bind(this);
        this.handleAddMedia = this.handleAddMedia.bind(this);
        this.handleChange = this.handleChange.bind(this);

   this.state = {
      //word: new Word({client: props.client}),
      word: null,
      children: null
   };

   getData(props.client, props.id).then((function(word){
      this.setState({
        word: word
      });
    }).bind(this));

   getChildren(props.client, props.id).then((function(children){
      this.setState({
        children: children
      });
    }).bind(this));
  }

  getStyles() {
    return {
      cursor: 'pointer',
      //.mui-font-style-headline
      fontSize: '24px',
      color: Typography.textFullWhite,
      lineHeight: Spacing.desktopKeylineIncrement + 'px',
      fontWeight: Typography.fontWeightLight,
      backgroundColor: Colors.cyan500,
      paddingLeft: Spacing.desktopGutter,
      paddingTop: '0px',
      marginBottom: '8px'
    };
  }


  handleStandardDialogTouchTap() {
    this.refs.standardDialog.show();
  }

  handleEditTouchTap() {
    this.props.router.navigate("contribute/edit/" + this.state.word.get('id') , {trigger: true});
    //this.refs.editDialog.show();

  }

  handleAddMedia() {
    this.refs.addMediaDialog.show();
  }

  handleChange(field) {
    //this.refs.editDialog.show();
  }

  render() {

      // Styles
      var DataGridStyles = {
        zIndex: 0
      };


var title, pronunciation, part_of_speech, description = "";


if (this.state.word != null) {

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
//console.log(video[0]);

        pictures.map(function(object, i){
          //console.log(object);
          //picturesBody += '<a label="Standard Actions" onClick="_this.handleStandardDialogTouchTap"><img src="' + object.properties['picture:views'][0].content.data + '" alt="Thumbnail of ' + object.properties['dc:title'] + '"/></a>';
      });

}

//Standard Actions
var standardActions = [
  { text: 'Close' }
];



var editView;
var addMediaView;

if (this.state.word != null && this.state.word.initialized) {
	editView = <Dialog
  id="editMe" 
  ref="editDialog"
  title={"Edit Entry " + title}
  actions={standardActions}
  modal={this.state.modal}>
  <div className="text-left">
    <WordEditView word={this.state.word} router={this.props.router} client={this.props.client} />
  </div>
</Dialog>
  addMediaView = <Dialog
  id="addMediaView" 
  ref="addMediaDialog"
  title={"Contribute Media to " + title + " Entry"}
  actions={standardActions}
  modal={this.state.modal}>
  <div className="text-left">
    <WordAddMediaView
      client={this.props.client}
      router={this.props.router} 
      word={this.state.word} />
  </div>
</Dialog>
}

          /*<CardMedia overlay={<CardTitle title="Title" subtitle="Subtitle"/>}>
            <img src="http://lorempixel.com/600/337/nature/"/>
          </CardMedia>*/



var picturesContent = [];
var audioContent = [];
var videoContent = [];

if (pictures != undefined && pictures.length > 0) {

  for (var i =0; i < pictures.length; i++) {

  picturesContent.push(<div className="col-xs-12">
    <img className="image" src={(pictures != undefined && pictures.length > 0) ? pictures[i].properties['picture:views'][2].content.data : ''} alt="Thumbnail of {object.properties['dc:title']}"/>
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

  videoContent.push(<video width="100%" height="auto" controls src={(video != undefined && video.length > 0) ? video[0].properties['vid:transcodedVideos'][0].content.data : ''} type={(video != undefined && video.length > 0) ? video[0].properties['vid:transcodedVideos'][0].content['mime-type'] : ''}>
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

          {editView}

          {addMediaView}

          <h2 style={this.getStyles().headline}>Definition</h2> 

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
      <h2 style={this.getStyles().headline}>Photos</h2> 
      <div dangerouslySetInnerHTML={{__html: picturesBody}} />
      <div className="row">{picturesContent}</div>
      </CardText>
    </div> 
  </Tab> 
  <Tab label="Audio" > 
    <div> 
      <CardText>
      <h2 style={this.getStyles().headline}>Audio</h2> 
      <div dangerouslySetInnerHTML={{__html: picturesBody}} />
      <div className="row">{audioContent}</div>

      </CardText>
    </div> 
  </Tab> 
  <Tab label="Video" > 
    <div> 
      <CardText>
      <h2 style={this.getStyles().headline}>Video</h2> 
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