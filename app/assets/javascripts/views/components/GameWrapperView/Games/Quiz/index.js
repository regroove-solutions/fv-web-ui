var React = require('react');
var t = require('tcomb-form');
var Form = t.form.Form;

var _ = require('underscore');

var classNames = require('classnames');
var Mui = require('material-ui');
var {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } = Mui;

//var ConfGlobal = require('configuration/Global.json');

var Word = require('models/Word');

var WordOperations = require('operations/WordOperations');

var Answer = require('./Answer');

class Quiz extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      word: props.word,
      answers: [],
      correctAnswer: Math.floor((Math.random() * 4) + 1) - 1,
      correctAnswerMedia: <div className={classNames('alert', 'alert-info', 'text-center')} role="alert">Loading...</div>
    };

    // TODO: Combine into one single query or nicer chaining
    WordOperations.getWordsByLangauge(props.client, props.language, "(dc:subjects LIKE '%biology')").then((function(answers){

      answers = _.sample(answers, 4);

      WordOperations.getMediaByWord(props.client, answers[this.state.correctAnswer].uid, "(ecm:primaryType='Picture')").then((function(correctAnswerMedia){
        WordOperations.getMediaBlobById(props.client, correctAnswerMedia[0].uid, correctAnswerMedia[0].properties['file:content']['mime-type']).then((function(imageData){
          this.setState({correctAnswerMedia: <div className="imgCont"><img className="image" src={imageData} alt=""/></div>});
        }).bind(this));
      }).bind(this));

      this.setState({
        answers: answers
      });

    }).bind(this));
  }

  render() {

    var displayAnswers = [];

    for (var i=0; i < 4; i++) {

      var correct = false;

      if (i === this.state.correctAnswer) {
        correct = true;
      }

      displayAnswers.push(<Answer data={this.state.answers[i]} correct={correct} />);
    }

    return <div className="quiz-container">
      <div className="row">
        <div className="col-xs-12">
          {this.state.correctAnswerMedia}
        </div>
      </div>
      <div className={classNames('row', 'row-answers')}>
        {displayAnswers}
      </div>
    </div>;
  }


}

Quiz.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Quiz;