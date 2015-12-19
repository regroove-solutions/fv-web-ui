var React = require('react');
var classNames = require('classnames');

var DirectoryOperations = require('../../../operations/DirectoryOperations');

class DialectListItem extends React.Component {

	render() {		

		return (
			<div className="dialectListItem">
				{this.props.title}
			</div>
		);
	}
}

class DialectList extends React.Component {
	
	render() {		
	    var dialectListItems = [];
	    
	    this.props.data.each(function(dialect) {
	    	var id = dialect.get("id");
	    	var title = dialect.get("title");
	    	dialectListItems.push(<DialectListItem key={id} title={title} />);
	    });		
	    return (
			<div className="dialectList">
				{dialectListItems}
			</div>
		);
	}
}

class DialectListView extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			dialects: null
    	};
    
		DirectoryOperations.getDialects(props.client, props.language).then((function(dialects){
	        this.setState({
	        	dialects: dialects
	        });
	    	console.log(dialects);
		}).bind(this));
	}
	
	render() {
		var dialectList = "";
		if(this.state.dialects != null && this.state.dialects.length > 0) {
			//console.log("Languages retrieved");
			dialectList = <DialectList data={this.state.dialects} />;
		}		
		return (
    		<div>{dialectList}</div>
		);
	}
}

module.exports = DialectListView;