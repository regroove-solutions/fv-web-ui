import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import Doughnut from 'react-chartjs/lib/doughnut';
import CircularProgress from 'material-ui/lib/circular-progress';

export default class Statistics extends Component {

  constructor(props, context) {
    super(props, context);
  }

  _generateLifecycleStateDoughnutData(data, docType) {
    let doughnutData = [];
    doughnutData.push({ value: data[docType].new, color: "#949FB1", highlight: "#A8B3C5", label: "New" });      
    doughnutData.push({ value: data[docType].enabled, color: "#FDB45C", highlight: "#FFC870", label: "Enabled" });   
    doughnutData.push({ value: data[docType].published, color: "#46BFBD", highlight: "#5AD3D1", label: "Published" }),
    doughnutData.push({ value: data[docType].disabled, color:"#F7464A", highlight: "#FF5A5E", label: "Disabled" })   
    return doughnutData;
  }  

  _generateTwoSliceDoughnutData(total, subset, labels) {
	    let doughnutData = [];
	    let totalMinusSubset = total - subset;
	    doughnutData.push({ value: totalMinusSubset, color: "#46BFBD", highlight: "#5AD3D1", label: labels[0] }),
	    doughnutData.push({ value: subset, color:"#F7464A", highlight: "#FF5A5E", label: labels[1] })   
	    return doughnutData;
  }   
  
  render() {
	
    let dataResponse = this.props.data;
    let docType = this.props.docType;	
    
    // If no documents of the specified type, don't display anything
    if(dataResponse[docType].total == '0') {
		return <div></div>;	
    }
    
	let lifecycleStateDoughnutData = this._generateLifecycleStateDoughnutData(dataResponse, docType);

    return (
		<div>
			<div className={'row'} style={{margin: '0 0 15px 0'}}>
	    		<h3>{this.props.headerText}: {dataResponse[docType].total}</h3>
	    		<div className={'col-lg-8'}>
	    			<Doughnut data={lifecycleStateDoughnutData} />
	    		</div>
	    		<div className={'col-lg-4'}>
		        	{lifecycleStateDoughnutData.map((slice, i) =>
		  		  		<div key={slice.label}><span className={'glyphicon glyphicon-stop'} style={{color: slice.color}} /> {slice.label}: {slice.value}</div>
			    	)}	
	    		</div>
    		</div>
    		
    		<ul>
	    		<li><strong>Created Today: </strong>{dataResponse[docType].created_today}</li>                         
	    		<li><strong>Modified Today: </strong>{dataResponse[docType].modified_today}</li> 
	    		<li><strong>Created Within Last 7 Days: </strong>{dataResponse[docType].created_within_7_days}</li>                         
	    		<li><strong>Available In Childrens Archive: </strong>{dataResponse[docType].available_in_childrens_archive}</li>    
    		</ul>
		</div>
    );
  }
}