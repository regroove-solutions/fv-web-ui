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

import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  approveRegistration,
  approveTask,
  fetchUserTasks,
  rejectRegistration,
  rejectTask,
} from 'providers/redux/reducers/tasks'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchUserDialects } from 'providers/redux/reducers/fvUser'

import selectn from 'selectn'

import FVButton from 'views/components/FVButton'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import DocumentView from 'views/components/Document/view'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import GroupAssignmentDialog from 'views/pages/users/group-assignment-dialog'
import '!style-loader!css-loader!./Tasks.css'
import FVLabel from '../../components/FVLabel/index'

const { func, object } = PropTypes
export class Tasks extends React.Component {
  static propTypes = {
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computeUserDialects: object.isRequired,
    computeUserRegistrationApprove: object.isRequired,
    computeUserRegistrationReject: object.isRequired,
    computeUserTasks: object.isRequired,
    computeUserTasksApprove: object.isRequired,
    computeUserTasksReject: object.isRequired,
    // REDUX: actions/dispatch/func
    approveRegistration: func.isRequired,
    approveTask: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchUserDialects: func.isRequired,
    fetchUserTasks: func.isRequired,
    rejectRegistration: func.isRequired,
    rejectTask: func.isRequired,
  }

  state = {
    open: false,
    preApprovalDialogOpen: false,
    selectedTask: null,
    selectedPreapprovalTask: null,
    lastActionedTaskId: null,
    userRegistrationTasksPath: '/management/registrationRequests/',
  }

  componentDidUpdate(prevProps) {
    const updatedUserId =
      selectn('response.id', prevProps.computeLogin) != selectn('response.id', this.props.computeLogin)
    const updatedUserTasksApprove = prevProps.computeUserTasksApprove != this.props.computeUserTasksApprove
    const updatedUserTasksReject = prevProps.computeUserTasksReject != this.props.computeUserTasksReject
    const updatedUserRegistrationApprove =
      prevProps.computeUserRegistrationApprove != this.props.computeUserRegistrationApprove
    const updatedUserRegistrationReject =
      prevProps.computeUserRegistrationReject != this.props.computeUserRegistrationReject

    if (
      updatedUserId ||
      updatedUserTasksApprove ||
      updatedUserTasksReject ||
      updatedUserRegistrationApprove ||
      updatedUserRegistrationReject
    ) {
      this._fetchData(this.props)
    }
  }

  componentDidMount() {
    this._fetchData(this.props)
  }

  render() {
    const userID = selectn('response.id', this.props.computeLogin)

    const computeEntities = Immutable.fromJS([
      {
        id: userID,
        entity: this.props.computeUserTasks,
      },
      {
        id: userID,
        entity: this.props.computeUserDialects,
      },
      {
        id: this.state.lastActionedTaskId,
        entity: this.props.computeUserTasksReject,
      },
    ])

    const computeUserDialects = ProviderHelpers.getEntry(this.props.computeUserDialects, userID)
    const _computeUserTasks = ProviderHelpers.getEntry(this.props.computeUserTasks, userID)

    const computeDialect = ProviderHelpers.getEntry(
      this.props.computeDialect2,
      selectn('properties.docinfo:documentId', this.state.selectedPreapprovalTask)
    )

    const userTasks = []
    const userRegistrationTasks = []

    // Compute General Tasks
    const computeUserTasksMap = selectn('response', _computeUserTasks) || []
    computeUserTasksMap.map((task, i) => {
      const tableRow = (
        <TableRow key={i}>
          <TableCell>
            <button
              type="button"
              className="FlatButton FlatButton--secondary Tasks__taskTitle"
              onClick={this._handleOpen.bind(this, task.docref)}
            >
              {task.documentTitle}
            </button>
          </TableCell>
          <TableCell className="Tasks__taskTypeContainer">
            <span className="Tasks__taskType">{this.props.intl.searchAndReplace(task.name)}</span>
          </TableCell>
          <TableCell>
            <div data-testid="Tasks__approveRejectContainer" className="Tasks__approveRejectContainer">
              <FVButton
                variant="contained"
                color="secondary"
                // className="RaisedButton RaisedButton--primary"
                onClick={(e) => {
                  e.preventDefault()
                  this._handleTaskActions(task.id, 'approve')
                }}
              >
                <FVLabel
                  transKey="approve"
                  defaultStr="Approve"
                  transform="first"
                />
              </FVButton>

              <FVButton
                variant="contained"
                color="secondary"
                // className="RaisedButton RaisedButton--primary Tasks__reject"
                onClick={(e) => {
                  e.preventDefault()
                  this._handleTaskActions(task.id, 'reject')
                }}
              >
                <FVLabel
                  transKey="reject"
                  defaultStr="Reject"
                  transform="first"
                />
              </FVButton>
            </div>
          </TableCell>
          <TableCell className="Tasks__taskDueDateContainer">
            <span className="Tasks__taskDueDate">{task.dueDate}</span>
          </TableCell>
        </TableRow>
      )

      userTasks.push(tableRow)
    })

    // Compute User Registration Tasks
    const computeUserDialectsMap = selectn('response.entries', computeUserDialects) || []
    computeUserDialectsMap.map((dialect, i) => {
      const uid = selectn('uid', dialect)

      const tableRow = (
        <li key={i}>
          <a href={'/tasks/users/' + uid}>
            Click here to view user registration requests to join{' '}
            <strong>{selectn('properties.dc:title', dialect)}</strong>
          </a>
        </li>
      )

      userRegistrationTasks.push(tableRow)
    })

    const noUserTasks =
      userTasks.length === 0 && userRegistrationTasks.length === 0 ? (
        <h2>
          <FVLabel
            transKey="views.pages.tasks.no_tasks"
            defaultStr="There are currently No tasks."
          />
        </h2>
      ) : null

    const userRegistrationTaskList = userRegistrationTasks.length > 0 ? <ul>{userRegistrationTasks}</ul> : null
    const userTasksTable =
      userTasks.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <span className="Tasks__colHeader">
                  <FVLabel
                    transKey="document_title"
                    defaultStr="Document Title"
                    transform="words"
                  />
                </span>
              </TableCell>
              <TableCell>
                <span className="Tasks__colHeader">
                  <FVLabel
                    transKey="task_type"
                    defaultStr="Task Type"
                    transform="words"
                  />
                </span>
              </TableCell>
              <TableCell>
                <span className="Tasks__colHeader Tasks__colHeader--actions">
                  <FVLabel
                    transKey="actions"
                    defaultStr="Actions"
                    transform="words"
                  />
                </span>
              </TableCell>
              <TableCell>
                <span className="Tasks__colHeader">
                  <FVLabel
                    transKey="task_due_date"
                    defaultStr="Task Due Date"
                    transform="words"
                  />
                </span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{userTasks}</TableBody>
        </Table>
      ) : null

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div>
          <h1>
            <FVLabel
              transKey="tasks"
              defaultStr="Tasks"
              transform="first"
            />
          </h1>

          {noUserTasks}

          {userRegistrationTaskList}

          {userTasksTable}

          <Dialog fullWidth maxWidth="md" open={this.state.open} onClose={this._handleClose}>
            <DialogContent>{this.state.selectedTask && <DocumentView id={this.state.selectedTask} />}</DialogContent>
          </Dialog>

          <GroupAssignmentDialog
            title={this.props.intl.trans('approve', 'Approve', 'first')}
            fieldMapping={{
              id: 'uid',
              title: 'properties.dc:title',
            }}
            open={this.state.preApprovalDialogOpen}
            saveMethod={this._saveMethod}
            closeMethod={this._handleClose}
            selectedItem={this.state.selectedPreapprovalTask}
            dialect={computeDialect}
          />
        </div>
      </PromiseWrapper>
    )
  }

  _fetchData = (newProps) => {
    const userId = selectn('response.id', newProps.computeLogin)
    newProps.fetchUserTasks(userId)
    ProviderHelpers.fetchIfMissing(userId, newProps.fetchUserDialects, newProps.computeUserDialects)
  }

  _handleClose = () => {
    this.setState({ open: false, preApprovalDialogOpen: false, selectedPreapprovalTask: null, selectedTask: null })
  }

  _handleOpen = (id) => {
    this.setState({ open: true, selectedTask: id })
  }

  _handlePreApprovalOpen = (task) => {
    this.props.fetchDialect2(selectn('properties.docinfo:documentId', task))
    this.setState({ preApprovalDialogOpen: true, selectedPreapprovalTask: task })
  }

  _handleRegistrationActions = (id, action) => {
    switch (action) {
      case 'approve':
        this.props.approveRegistration(
          id,
          {
            value: 'approve',
          },
          null,
          this.props.intl.trans('views.pages.tasks.request_approved', 'Request Approved Successfully', 'words')
        )
        break

      case 'reject':
        this.props.rejectRegistration(
          id,
          {
            value: 'reject',
          },
          null,
          this.props.intl.trans('views.pages.tasks.request_rejected', 'Request Rejected Successfully', 'words')
        )
        break
      default: // NOTE: do nothing
    }

    this.setState({ lastActionedTaskId: id })
  }

  _handleTaskActions = (id, action) => {
    switch (action) {
      case 'approve':
        this.props.approveTask(
          id,
          {
            comment: '',
            status: 'validate',
          },
          null,
          this.props.intl.trans('views.pages.tasks.request_approved', 'Request Approved Successfully', 'words')
        )
        break

      case 'reject':
        this.props.rejectTask(
          id,
          {
            comment: '',
            status: 'reject',
          },
          null,
          this.props.intl.trans('views.pages.tasks.request_rejected', 'Request Rejected Successfully', 'words')
        )
        break
      default: // NOTE: do nothing
    }

    this.setState({ lastActionedTaskId: id })
  }

  _saveMethod = (properties) => {
    this.props.approveRegistration(
      properties.id,
      {
        comment: properties.comment,
        group: properties.group,
        appurl: NavigationHelpers.getBaseWebUIURL(),
      },
      null,
      this.props.intl.trans('views.pages.tasks.request_approved', 'Request Approved Successfully', 'words')
    )

    this.setState({
      selectedPreapprovalTask: null,
      preApprovalDialogOpen: false,
    })
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvUser, tasks, nuxeo, locale } = state

  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computeUserDialects } = fvUser
  const {
    computeUserRegistrationApprove,
    computeUserRegistrationReject,
    computeUserTasks,
    computeUserTasksApprove,
    computeUserTasksReject,
  } = tasks
  const { intlService } = locale

  return {
    computeDialect2,
    computeLogin,
    computeUserDialects,
    computeUserRegistrationApprove,
    computeUserRegistrationReject,
    computeUserTasks,
    computeUserTasksApprove,
    computeUserTasksReject,
    intl: intlService,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  approveRegistration,
  approveTask,
  fetchDialect2,
  fetchUserDialects,
  fetchUserTasks,
  rejectRegistration,
  rejectTask,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tasks)
