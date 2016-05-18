/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import provide from 'react-redux-provide';


import RaisedButton from 'material-ui/lib/raised-button';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';

@provide
export default class Tasks extends React.Component {

	static propTypes = {
		fetchUserTasks: PropTypes.func.isRequired,
		computeUserTasks: PropTypes.object.isRequired,
	    approveDocument: PropTypes.func.isRequired,
	    rejectDocument: PropTypes.func.isRequired	
	};	

	constructor(props, context) {
		super(props, context);
	    
		   // Bind methods to 'this'
	    ['handleButtonTouchTap'].forEach( (method => this[method] = this[method].bind(this)) ); 		
	}

	handleButtonTouchTap(state) {
		console.log(state);
		switch(state) {
			case 'approve':
				this.props.approveDocument();
			break;
			
			case 'reject':
				this.props.rejectDocument();
			break;
		}
	}	
	
	fetchData(newProps) {	  
		newProps.fetchUserTasks();
	}

	// Fetch data on initial render
	componentDidMount() {  
		this.fetchData(this.props);
	}   



	
	render() {
		
		const { computeUserTasks } = this.props;

		let userTasks = [];
		
		if (computeUserTasks.success) {
			
			computeUserTasks.response.map(function(task, i) {
				
				// Convert nuxeo path to a valid webui path
				let documentPath = task.documentLink.replace("nxpath/default/", "explore/");
				documentPath = documentPath.split("@")[0];
				
//				console.log(task.doctype);				
//				switch(task.doctype) {
//					case("FVWord"):
//						documentPath = documentPath.replace("/Dictionary/", "/learn/words/");
//					break;
//					
//				}
								
			    let tableRow = <TableRow key={i}>
							        <TableRowColumn><a href={documentPath}>{task.documentTitle}</a></TableRowColumn>
							        <TableRowColumn>
							        	<span>{task.name}</span>
							        	<RaisedButton label="Approve" secondary={true} onTouchTap={this.handleButtonTouchTap.bind(this, 'approve')} />
							        	<RaisedButton label="Reject" secondary={true} onTouchTap={this.handleButtonTouchTap.bind(this, 'reject')} />
							        	</TableRowColumn>
							        <TableRowColumn>{task.dueDate}</TableRowColumn>
							   </TableRow>;
				
				userTasks.push(tableRow);
				
			}.bind(this))
		}	
		
		return <div>
			<h1>Tasks</h1>
			<Table>
			    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
					<TableRow>
				        <TableHeaderColumn>Document Title</TableHeaderColumn>
				        <TableHeaderColumn>Task Type</TableHeaderColumn>
				        <TableHeaderColumn>Task Due Date</TableHeaderColumn>
				    </TableRow>
			    </TableHeader>
			    <TableBody displayRowCheckbox={false}>
			    	{userTasks}			    
			    </TableBody>						
			</Table>
		</div>;
	}
}