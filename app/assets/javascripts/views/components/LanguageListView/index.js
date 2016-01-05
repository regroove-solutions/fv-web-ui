var React = require('react');
var classNames = require('classnames');

var Languages = require('models/Languages');

var DirectoryOperations = require('../../../operations/DirectoryOperations');

class LanguageListItem extends React.Component {

	render() {		
		var dialectsLink = "#explore/" + this.props.family + "/" + this.props.title;
		var inlineStyles = {
				height: '200px'
		};
		
		return (
				
            <div className="col-xs-12 col-md-3">
	            <div className="well" style={inlineStyles}>
	              <h3>{this.props.title}</h3>
	              <p>{this.props.description}</p>
	              <a href={dialectsLink} className={classNames('btn', 'btn-primary')}>Explore the {this.props.title} dialects</a>
	            </div>
            </div>				
			
		);
	}
}

class LanguageList extends React.Component {

	render() {
    	var family = this.props.family;
	    var languageListItems = [];
	    
	    this.props.data.each(function(language) {
	    	var id = language.get("id");
	    	var title = language.get("dc:title");
	    	var description = language.get("dc:description");	    	
	    	languageListItems.push(<LanguageListItem key={id} title={title} family={family} description={description} />);	    	
	    });		
	    	
	    return (
			<div className="languageList">
				{languageListItems}
			</div>
		);
	}
}

class LanguageListView extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			languages: null
    	};
		
		DirectoryOperations.getLanguages(props.client, props.family).then((function(languages){
	        this.setState({
	        	languages: languages
	        });
	    	//console.log(languages);
		}).bind(this));		
	}

	render() {
		//console.log(this.props.family);
		var languageList = "";
		if(this.state.languages != null && this.state.languages.length > 0) {
			languageList = <LanguageList data={this.state.languages} family={this.props.family} />;
		}
		return (
    		<div>{languageList}</div>
		);
	}
}

module.exports = LanguageListView;