var React = require('react');
var classNames = require('classnames');
var Mui = require('material-ui');
var PubSub = require('pubsub-js');
var {RaisedButton} = Mui;

//var ConfGlobal = require('configuration/Global.json');

// https://github.com/facebook/react/issues/3451#issuecomment-83000311
var ThemeManager = new Mui.Styles.ThemeManager();

class Answer extends React.Component {

  constructor(props) {
    super(props);

    this.eventName = this.constructor.name.toUpperCase();

    this._handleClick = this._handleClick.bind(this);

    this.state = {};
  }


  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _getStyles() {
    return {
      'width': '100%'
    }
  }

  _handleClick() {
    PubSub.publish( this.eventName + ":SELECTED", this.props.data.uid );
  }

  render() {
    return <div className="col-xs-6">
      <RaisedButton style={this._getStyles()} primary={this.props.selected} onTouchTap={this._handleClick} label={(this.props.data) ? this.props.data['dc:title'] : 'Loading...'} />
    </div>;
  }
}

Answer.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Answer;