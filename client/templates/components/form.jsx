var MyWidget = React.createClass({
  handleClick: function() {
    alert('Hello!');
  },
  render: function() {
    return (
      <a href="#" onClick={this.handleClick}>Do something!</a>
    );
  }
});