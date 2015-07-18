var React = require('react');

//var classNames = require('classnames');

var Quiz = require('./Games/Quiz');

class GameWrapperView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {

    var label, content ="";

    switch (this.props.game){
      case 'quiz':
        label = "Quiz";
        content = <Quiz
                    client={this.props.client}
                    language={this.props.language} />;
      break;
    }

    return (
      <div className="gameWrapperView">
        <h2>{label}</h2>
        {content}
      </div>
    );
  }
}

GameWrapperView.contextTypes = {
  router: React.PropTypes.func
};

module.exports = GameWrapperView;