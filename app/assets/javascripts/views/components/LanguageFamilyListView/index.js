var React = require('react');
var classNames = require('classnames');

var LanguageFamilies = require('models/LanguageFamilies');

var DirectoryOperations = require('../../../operations/DirectoryOperations');

class LanguageFamilyListItem extends React.Component {

	render() {
		var languageFamilyLink = "#explore/" + this.props.title;
		var inlineStyles = {
				height: '200px'
		};
		
		var countries;
		if(this.props.countries && this.props.countries != "") {
			countries = <p><strong>Countries:</strong> {this.props.countries}</p>;
		}
		
		return (	
				
            <div className="col-xs-12 col-md-4">
	            <div className="well" style={inlineStyles}>
	              <h3>{this.props.title}</h3>
	              <p>{this.props.description}</p>
	              {countries}	              
	              <a href={languageFamilyLink} className={classNames('btn', 'btn-primary')}>Explore Language Family</a>
	            </div>
            </div>			
			
		);
	}
}

class LanguageFamilyList extends React.Component {

	constructor(props) {
		super(props);

		var languageFamilyItems = [];

	    this.props.data.each(function(family) {
	    	var id = family.get("id");
	    	var title = family.get("dc:title");
	    	var description = family.get("dc:description");	
	    	var countries = family.get("fvlanguagefamily:countries");	
	    	languageFamilyItems.push(<LanguageFamilyListItem key={id} title={title} description={description} countries={countries} />);
	    });

		this.state = {
			languageFamilyListItems: languageFamilyItems
    	};
	}

	render() {
		return (
			<div className="languageFamilyList">
				{this.state.languageFamilyListItems}	
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