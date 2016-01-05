var React = require('react');
var classNames = require('classnames');

var DirectoryOperations = require('../../../operations/DirectoryOperations');

class DialectListItem extends React.Component {

	render() {		
		var dialectLink = "#explore/" + this.props.family + "/" + this.props.language + "/" + this.props.title;;
		
		return (
	
            <div className="col-xs-12 col-md-3">
	            <div className="well">
	              <h3>{this.props.title}</h3>
	              <p>{this.props.description}</p>
	              <p>Country: {this.props.country}</p>
	              <p>Region: {this.props.region}</p>
	              <p>Dominant Language: {this.props.dominantLanguage}</p>
	              <a href={dialectLink} className={classNames('btn', 'btn-primary')}>Explore the {this.props.title} dialect</a>
	            </div>
	        </div>				
			
		);
	}
}

class DialectList extends React.Component {
	
	render() {		
	    var dialectListItems = [];
    	var family = this.props.family;
    	var language = this.props.language;	    
	    
	    this.props.data.each(function(dialect) {
	    	var id = dialect.get("id");
	    	var title = dialect.get("dc:title");
	    	var description = dialect.get("dc:description");
	    	var country = dialect.get("fvdialect:country");
	    	var region = dialect.get("fvdialect:region");
	    	var dominantLanguage = dialect.get("fvdialect:dominant_language");	    	
	    	dialectListItems.push(<DialectListItem key={id} title={title} family={family} language={language} description={description} country={country} region={region} dominantLanguage={dominantLanguage} />);
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
			dialectList = <DialectList data={this.state.dialects} family={this.props.family} language={this.props.language} />;
		}		
		return (
    		<div>{dialectList}</div>
		);
	}
}

module.exports = DialectListView;