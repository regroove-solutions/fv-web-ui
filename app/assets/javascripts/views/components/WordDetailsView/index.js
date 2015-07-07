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
var Word = require('models/Word');


//var DataGrid = require('react-datagrid');

//require('!style!css!react-datagrid/dist/index.min.css');


var _ = Underscore;

var currentWord;
var {Colors, Spacing, Typography} = Mui.Styles;

     
        /**
         * Models
         */


     // Query documents from Nuxeo
  var workspace;


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
                currentWord = new Word(response.entries[0]);
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

          client.operation('Document.GetChildren')
          .input(word)
          /*.params({
              query: "SELECT * FROM Document WHERE (ecm:uuid = '" + word + "' AND ecm:primaryType = 'Word')"
          })*/
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
        this.handleChange = this.handleChange.bind(this);

   this.state = {
      word: new Word(),
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
    this.refs.editDialog.show();
  }

  handleChange(field) {
    //this.refs.editDialog.show();
  }

  render() {

      // Styles
      var DataGridStyles = {
        zIndex: 0
      };

var defs = this.state.word.get('definitions');
var definitionsBody, subjectsBody, picturesBody = "";

if (defs != undefined && defs.length > 0){

    definitionsBody = "<p><strong>Definitions:</strong></p>" + "<ul>"

        defs.map(function(object, i){
          definitionsBody += '<li>' + object + '</li>';
      });

    definitionsBody += "</ul>";
}

var subjects = this.state.word.get('subjects');

if (subjects != undefined && subjects.length > 0){

    subjectsBody = "<p><strong>Subjects:</strong></p>" + "<ul>"

        subjects.map(function(object, i){
          subjectsBody += '<li style="text-transform:capitalize;">' + object + '</li>';
      });

    subjectsBody += "</ul>";
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



          /*<CardMedia overlay={<CardTitle title="Title" subtitle="Subtitle"/>}>
            <img src="http://lorempixel.com/600/337/nature/"/>
          </CardMedia>*/
    return (
      <div>

        <Card>

          <CardHeader
            title={this.state.word.get('title')}
            subtitle={"Pronunciation: " + this.state.word.get('pronunciation')}
            avatar="http://lorempixel.com/100/100/"/>
<Tabs> 
  <Tab label="Definition" > 
    <div> 
          <CardText>

<WordEditView word={this.state.word} />

          <h2 style={this.getStyles().headline}>Definition</h2> 

            <div>
              <p>{this.state.word.get('description')}</p>
            </div>

            <div dangerouslySetInnerHTML={{__html: (this.state.word.get('part_of_speech') != null) ? '<p><strong>Part of Speech</strong>: <span style="text-transform:capitalize;">' + this.state.word.get('part_of_speech') + "</span></p>" : ''}} />
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
<Dialog
  ref="standardDialog"
  title={"Photo of " + this.state.word.get('title')}
  actions={standardActions}
  modal={this.state.modal}>
  <div className="text-center">
  <img src={(pictures != undefined && pictures.length > 0) ? pictures[0].properties['picture:views'][2].content.data : ''} alt="Thumbnail of {object.properties['dc:title']}"/>
  </div>
</Dialog>

/*<Dialog
  id="one11"
  ref="editDialog"
  title={"Edit Entry " + this.state.word.get('title')}
  actions={standardActions}
  modal={this.state.modal}>
  <div className="text-left">
    <WordEditView word={this.state.word} />
  </div>
</Dialog>*/

 <a label="Standard Actions" onTouchTap={this.handleStandardDialogTouchTap}>
 <img src={(pictures != undefined && pictures.length > 0) ? pictures[0].properties['picture:views'][0].content.data : ''} alt="Thumbnail of {object.properties['dc:title']}"/>
 </a>
      </CardText>
    </div> 
  </Tab> 
  <Tab label="Audio" > 
    <div> 
      <CardText>
      <h2 style={this.getStyles().headline}>Audio</h2> 
      <div dangerouslySetInnerHTML={{__html: picturesBody}} />

<audio src={(audio != undefined && audio.length > 0) ? audio[0].properties['file:content'].data : ''} preload="auto" controls="controls">
Your browser does not support the audio element.
</audio>
      </CardText>
    </div> 
  </Tab> 
  <Tab label="Video" > 
    <div> 
      <CardText>
      <h2 style={this.getStyles().headline}>Video</h2> 
      <div dangerouslySetInnerHTML={{__html: picturesBody}} />

<video width="320" height="240" controls src={(video != undefined && video.length > 0) ? video[0].properties['vid:transcodedVideos'][0].content.data : ''} type={(video != undefined && video.length > 0) ? video[0].properties['vid:transcodedVideos'][0].content['mime-type'] : ''}>
Your browser does not support the video tag.
</video>
      </CardText>
    </div> 
  </Tab> 
</Tabs> 

        </Card>


<Toolbar>
  <ToolbarGroup key={0} float="right">
    <FontIcon className={classNames('glyphicon', 'glyphicon-pencil')} onTouchTap={this.handleEditTouchTap} />
    <ToolbarSeparator/>
    <RaisedButton label="Contribute Media" primary={true} />
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