import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import Doughnut from 'react-chartjs/lib/doughnut';
import CircularProgress from 'material-ui/lib/circular-progress';

export default class StatsPanel extends Component {

  constructor(props, context) {
    super(props, context);
  }

  _generateDoughnutData(data, docType) {
    let doughnutData = [];
    doughnutData.push({ value: data[docType].new, color: "#949FB1", highlight: "#A8B3C5", label: "New" });      
    doughnutData.push({ value: data[docType].enabled, color: "#FDB45C", highlight: "#FFC870", label: "Enabled" });   
    doughnutData.push({ value: data[docType].published, color: "#46BFBD", highlight: "#5AD3D1", label: "Published" }),
    doughnutData.push({ value: data[docType].disabled, color:"#F7464A", highlight: "#FF5A5E", label: "Disabled" })   
    return doughnutData;
  }  
  
  render() {
    
	if (!this.props.data.success) {
		return ( 
			<div className={classNames('col-xs-12', 'col-md-6')}>
				<CircularProgress mode="indeterminate" size={3} />
			</div>
		);
	}
	
    let dataResponse = this.props.data.response;
    let docType = this.props.docType;	
	let doughnutData = this._generateDoughnutData(dataResponse, docType);
	  
    return (
		<div className={classNames('col-xs-12', 'col-md-6')}>
    		<h1>{this.props.headerText}</h1>
    		<p><strong>Total:</strong> {dataResponse[docType].total}</p>
    		<p><strong>New:</strong> {dataResponse[docType].new}</p>
    		<p><strong>Enabled:</strong> {dataResponse[docType].enabled}</p>
    		<p><strong>Published:</strong> {dataResponse[docType].published}</p> 
    		<p><strong>Disabled:</strong> {dataResponse[docType].disabled}</p> 

    		<Doughnut data={doughnutData} />
    		
    		<p><strong>Created Today:</strong> {dataResponse[docType].created_today}</p>                         
    		<p><strong>Modified Today:</strong> {dataResponse[docType].modified_today}</p>                             		
    		<p><strong>Without Related Audio:</strong> {dataResponse[docType].without_audio}</p>                         
    		<p><strong>Without Related Pictures:</strong> {dataResponse[docType].without_images}</p>
    		<p><strong>Without Related Video:</strong> {dataResponse[docType].without_video}</p>                             		
    		<p><strong>Without Source:</strong> {dataResponse[docType].without_source}</p>                         
		
    		<p><strong>Most Recently Modified:</strong></p>
    		<ul>
    		{dataResponse[docType].most_recently_modified.map((document, i) => 
    		  <li key={document['ecm:uuid']}><a href={'/explore' + document['ecm:path']}>{document['dc:title']}</a> 
    		    <br />{document['dc:modified']} by {document['dc:lastContributor']}
    		  </li>
    		)}
    		</ul>
    		<p><strong>My Most Recently Modified:</strong></p>
    		<ul>
    		{dataResponse[docType].user_most_recently_modified.map((document, i) => 
    		  <li key={document['ecm:uuid']}><a href={'/explore' + document['ecm:path']}>{document['dc:title']}</a> 
    		    <br />{document['dc:modified']} by {document['dc:lastContributor']}
    		  </li>
    		)}
    		</ul>        
		</div>
    );
  }
}