var React = require('react');
var classNames = require('classnames');

var DirectoryOperations = require('../../../operations/DirectoryOperations');

class DialectListItem extends React.Component {

	render() {		
		var dialectLink = "#explore/" + this.props.family + "/" + this.props.language + "/" + this.props.title;
		
		return (
	
            <div className="col-xs-12 col-md-12">
	            <div className="well">
	              <h3>{this.props.title}</h3>
	              <p dangerouslySetInnerHTML={{__html: this.props.description}} />
	              <p><strong>Country:</strong> {this.props.country}</p>
	              <p><strong>Region:</strong> {this.props.region}</p>
	              <p><strong>Dominant Language:</strong> {this.props.dominantLanguage}</p>
	              <a href={dialectLink} className={classNames('btn', 'btn-primary')}>Explore Dialect</a>
	            </div>
	        </div>				
			
		);
	}
}

class DialectList extends React.Component {
	
	constructor(props) {
		super(props);
    
	    var dialectItems = [];
    	var family = this.props.family;
    	var language = this.props.language;	    
	    
	    this.props.data.each(function(dialect) {
	    	var id = dialect.get("id");
	    	var title = dialect.get("dc:title");
	    	var description = dialect.get("dc:description");
	    	var country = dialect.get("fvdialect:country");
	    	var region = dialect.get("fvdialect:region");
	    	var dominantLanguage = dialect.get("fvdialect:dominant_language");	    	
	    	dialectItems.push(<DialectListItem key={id} title={title} family={family} language={language} description={description} country={country} region={region} dominantLanguage={dominantLanguage} />);
	    });

		this.state = {
			dialectListItems: dialectItems
    	};
	}

	render() {		
	
	    return (
			<div className="dialectList">
				{this.state.dialectListItems}
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