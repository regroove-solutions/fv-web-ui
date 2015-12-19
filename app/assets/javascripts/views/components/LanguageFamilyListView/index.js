var React = require('react');
var classNames = require('classnames');

var LanguageFamilies = require('models/LanguageFamilies');

var DirectoryOperations = require('../../../operations/DirectoryOperations');

class LanguageFamilyListItem extends React.Component {

	render() {
		var languageFamilyLink = "#browse/family/" + this.props.title;
		return (
			<div className="languageFamilyListItem">
				<span>{this.props.title} </span><a href={languageFamilyLink}>[Explore Languages]</a>
			</div>
		);
	}
}

class LanguageFamilyList extends React.Component {

	render() {		
	    var languageFamilyListItems = [];
		
	    this.props.data.each(function(family) {
	    	var id = family.get("id");
	    	var title = family.get("dc:title");
	    	languageFamilyListItems.push(<LanguageFamilyListItem key={id} title={title} />);
	    });
		
		return (
			<div className="languageFamilyList">
				{languageFamilyListItems}	
			</div>
		);
	}
}

class LanguageFamilyListView extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			languageFamilies: null
    	};
    
		DirectoryOperations.getLanguageFamilies(props.client).then((function(families){
	        this.setState({
	        	languageFamilies: families
	        });
	    	console.log(languageFamilies);
		}).bind(this));
	}

	render() {
		var languageFamilyList = "";
		if(this.state.languageFamilies != null && this.state.languageFamilies.length > 0) {
			languageFamilyList = <LanguageFamilyList data={this.state.languageFamilies} />;
		}
		return (
    		<div>
				{languageFamilyList}
            </div>
		);
	}
}

module.exports = LanguageFamilyListView;