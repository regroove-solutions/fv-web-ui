import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import Doughnut from 'react-chartjs/lib/doughnut';

export default class StatsPanel extends Component {

  constructor(props, context) {
    super(props, context);
  }

  _generateDoughnutData() {
    let doughnutData = [];
    doughnutData.push({ value: this.props.data[this.props.childElementName].disabled, color:"#F7464A", highlight: "#FF5A5E", label: "Disabled" })
    doughnutData.push({ value: this.props.data[this.props.childElementName].enabled, color: "#46BFBD", highlight: "#5AD3D1", label: "Enabled" }),
    doughnutData.push({ value: this.props.data[this.props.childElementName].new, color: "#FDB45C", highlight: "#FFC870", label: "New" });
    return doughnutData;
  }  
  
  render() {
	
	let doughnutData = this._generateDoughnutData();
	  
    return (
		<div className={classNames('col-xs-12', 'col-md-6')}>
    		<h1>{this.props.headerText}</h1>
    		<p><strong>Total:</strong> {this.props.data[this.props.childElementName].total}</p>
    		<p><strong>New:</strong> {this.props.data[this.props.childElementName].new}</p>
    		<p><strong>Enabled:</strong> {this.props.data[this.props.childElementName].enabled}</p>
    		<p><strong>Disabled:</strong> {this.props.data[this.props.childElementName].disabled}</p>                         

    		<Doughnut data={doughnutData} />
{/*
    		<p><strong>Created Today:</strong> {this.props.data[this.props.childElementName].created_today}</p>
    		<p><strong>Modified Today:</strong> {this.props.data[this.props.childElementName].modified_today}</p>

			<p><strong>Most Recently Created:</strong></p>
    		<ul>
    		{this.props.data[this.props.childElementName].most_recently_created.map((document, i) => 
    		  <li key={document['ecm:uuid']}><a href={'/explore' + document['ecm:path']}>{document['dc:title']}</a> 
    			<br />{document['dc:created']} by {document['dc:creator']}
    		  </li>
    		)}
    		</ul>
*/}    		
    		<p><strong>Most Recently Modified:</strong></p>
    		<ul>
    		{this.props.data[this.props.childElementName].most_recently_modified.map((document, i) => 
    		  <li key={document['ecm:uuid']}><a href={'/explore' + document['ecm:path']}>{document['dc:title']}</a> 
    		    <br />{document['dc:modified']} by {document['dc:lastContributor']}
    		  </li>
    		)}
    		</ul>
    		<p><strong>My Most Recently Modified:</strong></p>
    		<ul>
    		{this.props.data[this.props.childElementName].user_most_recently_modified.map((document, i) => 
    		  <li key={document['ecm:uuid']}><a href={'/explore' + document['ecm:path']}>{document['dc:title']}</a> 
    		    <br />{document['dc:modified']} by {document['dc:lastContributor']}
    		  </li>
    		)}
    		</ul>        
		</div>
    );
  }
}