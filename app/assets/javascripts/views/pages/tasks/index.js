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

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';

@provide
export default class Tasks extends React.Component {

	static propTypes = {
		fetchUserTasks: PropTypes.func.isRequired,
		computeUserTasks: PropTypes.object.isRequired
	};	

	constructor(props, context) {
		super(props, context);
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
				
				console.log(task.doctype);
				
				switch(task.doctype) {
					case("FVWord"):
						documentPath = documentPath.replace("/Dictionary/", "/learn/words/");
					break;
					
				}
				
				//documentPath = documentPath.replace("nxpath/default/", "explore/");
				//documentPath = documentPath.replace("/Dictionary/", "/learn/words/");
				//documentPath = documentPath.split("@")[0];
								
			    let tableRow = <TableRow key={i}>
							        <TableRowColumn><a href={documentPath}>{task.documentTitle}</a></TableRowColumn>
							        <TableRowColumn>{task.name}</TableRowColumn>
							        <TableRowColumn>{task.dueDate}</TableRowColumn>
							   </TableRow>;
				
				userTasks.push(tableRow);
				
			})
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