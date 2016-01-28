var React = require('react');

var Quiz = require('./Games/Quiz');
var MultiQuiz = require('./Games/MultiQuiz');

class GameWrapperView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {

    var label, content ="";

    switch (this.props.game){
      case 'quiz':
        label = "Single Photo Quiz";
        content = <Quiz
                    client={this.props.client}
                    category={this.props.category} 
                    language={this.props.language} />;
      break;

      case 'multi-quiz':
        label = "Multiple Photo Quiz";
        content = <MultiQuiz
                    client={this.props.client}
                    category={this.props.category} 
                    language={this.props.language} />;
      break;
    }

    return (
      <div className="gameWrapperView">
        {content}
      </div>
    );
  }
}

module.exports = GameWrapperView;