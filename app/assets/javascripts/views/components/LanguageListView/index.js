var React = require('react');
var classNames = require('classnames');

var Languages = require('models/Languages');

var DirectoryOperations = require('../../../operations/DirectoryOperations');

class LanguageListItem extends React.Component {

	render() {		
		var languageLink = "#explore/" + this.props.family + "/" + this.props.title;
		/*var inlineStyles = {
				height: '200px'
		};*/
		
		return (
				
            <div className="col-xs-12 col-md-12">
	            <div className="well">
	              <h3>{this.props.title}</h3>
	              <p>{this.props.description}</p>
	              <a href={languageLink} className={classNames('btn', 'btn-primary')}>Explore Language</a>
	            </div>
            </div>				
			
		);
	}
}

class LanguageList extends React.Component {

	constructor(props) {
		super(props);

    	var family = this.props.family;
	    var languageItems = [];
	    
	    this.props.data.each(function(language) {
	    	var id = language.get("id");
	    	var title = language.get("dc:title");
	    	var description = language.get("dc:description");	    	
	    	languageItems.push(<LanguageListItem key={id} title={title} family={family} description={description} />);	    	
	    });	

	    this.state = {
			languageListItems: languageItems
	    };
	}

	render() {
	    return (
			<div className="languageList">
				{this.state.languageListItems}
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