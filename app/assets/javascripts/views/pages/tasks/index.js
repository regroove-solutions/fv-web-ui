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
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import Dialog from 'material-ui/lib/dialog';

import ProviderHelpers from 'common/ProviderHelpers';

import RaisedButton from 'material-ui/lib/raised-button';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';

import DocumentView from 'views/components/Document/view';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

@provide
export default class Tasks extends React.Component {

	static propTypes = {
		fetchUserTasks: PropTypes.func.isRequired,
		computeUserTasks: PropTypes.object.isRequired,
		computeLogin: PropTypes.object.isRequired,
	    approveTask: PropTypes.func.isRequired,
	    computeUserTasksApprove: PropTypes.object.isRequired,
	    rejectTask: PropTypes.func.isRequired,
	    computeUserTasksReject: PropTypes.object.isRequired
	};	

	constructor(props, context) {
		super(props, context);
	    
		this.state = {
			open: false,
			selectedTask: null,
			lastActionedTaskId: null
		};

		   // Bind methods to 'this'
	    ['handleButtonTouchTap', '_handleOpen', '_handleClose'].forEach( (method => this[method] = this[method].bind(this)) ); 		
	}

	handleButtonTouchTap(id, action) {
		switch(action) {
			case 'approve':
				this.props.approveTask(id, {
					comment: '',
					status: 'validate'
				}, null, 'Request approved succesfully.');
			break;
			
			case 'reject':
				this.props.rejectTask(id, {
					comment: '',
					status: 'reject'
				}, null, 'Request rejected succesfully.');
			break;
		}

		this.setState({lastActionedTaskId: id});
	}	

	fetchData(newProps) {
		newProps.fetchUserTasks(selectn('response.id', newProps.computeLogin));
	}

	componentWillReceiveProps(newProps) {
		if (newProps.computeLogin != this.props.computeLogin) {
			this.fetchData(newProps);
		}

		else if (newProps.computeUserTasksApprove != this.props.computeUserTasksApprove) {
			this.fetchData(newProps);
		}

		else if (newProps.computeUserTasksReject != this.props.computeUserTasksReject) {
			this.fetchData(newProps);
		}
	}

	componentDidMount() {
		this.fetchData(this.props);
	}

	_handleOpen(id) {
		this.setState({open: true, selectedTask: id});
	}

	_handleClose() {
		this.setState({open: false, selectedTask: null});
	}
	
	render() {

		const userID = selectn('response.id', this.props.computeLogin);

	    const computeEntities = Immutable.fromJS([{
	      'id': userID,
	      'entity': this.props.computeUserTasks
	    },{
	      'id': this.state.lastActionedTaskId,
	      'entity': this.props.computeUserTasksReject
	    }])

	    const computeUserTasks = ProviderHelpers.getEntry(this.props.computeUserTasks, userID);

		let userTasks = [];

		(selectn('response', computeUserTasks) || []).map(function(task, i) {

		    let tableRow = <TableRow key={i}>
						        <TableRowColumn>
						        	<a onTouchTap={this._handleOpen.bind(this, task.docref)}>{task.documentTitle}</a>
						        </TableRowColumn>
						        <TableRowColumn>
						        	<span>{task.name}</span>
					        	</TableRowColumn>
					        	<TableRowColumn>
						        	<RaisedButton label="Approve" secondary={true} onTouchTap={this.handleButtonTouchTap.bind(this, task.id, 'approve')} /> &nbsp;
						        	<RaisedButton label="Reject" secondary={true} onTouchTap={this.handleButtonTouchTap.bind(this, task.id, 'reject')} />
					        	</TableRowColumn>
						        <TableRowColumn>{task.dueDate}</TableRowColumn>
						   </TableRow>;
			
			userTasks.push(tableRow);
			
		}.bind(this));
	
	    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

	            <div>
			<h1>Tasks</h1>
			<Table>
			    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
					<TableRow>
				        <TableHeaderColumn>Document Title</TableHeaderColumn>
				        <TableHeaderColumn>Task Type</TableHeaderColumn>
				        <TableHeaderColumn>Actions</TableHeaderColumn>
				        <TableHeaderColumn>Task Due Date</TableHeaderColumn>
				    </TableRow>
			    </TableHeader>
			    <TableBody displayRowCheckbox={false}>
			    	{userTasks}			    
			    </TableBody>						
			</Table>

	      	<Dialog
          		open={this.state.open}
          		onRequestClose={this._handleClose}
          		autoScrollBodyContent={true}>  
          		<DocumentView id={this.state.selectedTask} />
        	</Dialog>

		</div>

        </PromiseWrapper>;
	}
}