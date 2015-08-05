var React = require('react');
var classNames = require('classnames');
var Mui = require('material-ui');
var _ = require('underscore');
var PubSub = require('pubsub-js');
var {RaisedButton} = Mui;

var WordOperations = require('operations/WordOperations');

var injectTapEventPlugin = require("react-tap-event-plugin");

// https://github.com/facebook/react/issues/3451#issuecomment-83000311
var ThemeManager = new Mui.Styles.ThemeManager();

class AnswerMQ extends React.Component {

  constructor(props) {
    super(props);

    //Needed for onTouchTap
    //Can go away when react 1.0 release
    //Check this repo:
    //https://github.com/zilverline/react-tap-event-plugin
    injectTapEventPlugin();

    this.eventName = "ANSWERMQ";

    this._handleClick = this._handleClick.bind(this);

    this.state = {
      answer: props.data,
      image: null,
      audio: null,
      answerMedia: []
    };

    if (props.data != undefined && props.data.uid.length > 0) {
      WordOperations.getMediaByWord(props.client, props.data.uid, "(ecm:primaryType='Picture' OR ecm:primaryType='Audio')").then((function(answerMedia){


        var tmpArray = [];
        tmpArray['picture'] = _.findWhere(answerMedia, {type: 'Picture'});
        tmpArray['audio'] = _.findWhere(answerMedia, {type: 'Audio'});

        this.setState({answerMedia: tmpArray});

        WordOperations.getMediaBlobById(props.client, this.state.answerMedia['picture'].uid, this.state.answerMedia['picture'].properties['file:content']['mime-type'], 'picture:views/item[2]/content').then((function(response){
          this.setState({
            image: response.dataUri
          });
        }).bind(this));
      }).bind(this));
    }
  }


  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _handleClick() {

    if (this.state.audio == null) {
      WordOperations.getMediaBlobById(this.props.client, this.state.answerMedia['audio'].uid, this.state.answerMedia['audio'].properties['file:content']['mime-type']).then((function(response){
        this.setState({
          audio: response.dataUri
        });
      }).bind(this));
    }

    // TODO: Stop all other audio
    var selectedAudio = document.getElementById(this.state.answer.uid + '-audio');
    var allAudio = document.getElementsByClassName('audio');

    _.each(allAudio, function(element) {
      if (element != undefined && element.canplay) {
        element.pause();
        element.currentTime = 0;
      }
    });

    selectedAudio.play();

    PubSub.publish( this.eventName + ":SELECTED", this.props.data.uid );
  }

  render() {

    return <div className="col-xs-6">
      <div className={classNames('imgContAnswer', (this.props.selected) ? 'selectedImgContAnswer' : '')}>
        {(this.state.image != null) ? <img onTouchTap={this._handleClick} className="image" src={this.state.image} alt=""/> : 'Loading...' }
      </div>
      <audio src={this.state.audio} className="audio" id={(this.state.answer != undefined) ? this.state.answer.uid + '-audio' : ''} type="audio/mp4" preload="auto" />
    </div>;
  }
}

AnswerMQ.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = AnswerMQ;