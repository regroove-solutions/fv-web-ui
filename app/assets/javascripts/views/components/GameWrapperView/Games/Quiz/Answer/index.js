var React = require('react');
var classNames = require('classnames');
var Mui = require('material-ui');
var {RaisedButton} = Mui;

//var ConfGlobal = require('configuration/Global.json');

class Answer extends React.Component {

  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);

    this.state = {
      answer: props.word
    };
  }

  _getStyles() {
    return {
      'width': '100%'
    }
  }

  _handleClick() {
    alert(this.props.correct);
  }

  render() {

    return <div className="col-xs-6">
      <RaisedButton style={this._getStyles()} onTouchTap={this._handleClick} label={(this.props.data) ? this.props.data['dc:title'] : 'Loading...'} />
    </div>;
  }
}

Answer.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Answer;