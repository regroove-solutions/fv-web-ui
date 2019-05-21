import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

const computeUserTasksOperation = RESTReducers.computeOperation('user_tasks')
const computeTasksOperation = RESTReducers.computeOperation('tasks')
const computeUserTasksApproveOperation = RESTReducers.computeOperation('user_tasks_approve')
const computeUserTasksRejectOperation = RESTReducers.computeOperation('user_tasks_reject')
const computeCountTotalTasksFactory = RESTReducers.computeOperation('count_total_tasks')
const computeUserRegistrationTasksFactory = RESTReducers.computeOperation('user_registration')
const computeUserRegistrationApproveOperation = RESTReducers.computeOperation('user_registration_approve')
const computeUserRegistrationRejectOperation = RESTReducers.computeOperation('user_registration_reject')

export const tasksReducer = combineReducers({
  computeTasks: computeTasksOperation.computeTasks,
  computeUserTasks: computeUserTasksOperation.computeUserTasks,
  computeUserTasksApprove: computeUserTasksApproveOperation.computeUserTasksApprove,
  computeUserTasksReject: computeUserTasksRejectOperation.computeUserTasksReject,
  computeCountTotalTasks: computeCountTotalTasksFactory.computeCountTotalTasks,
  computeUserRegistrationTasks: computeUserRegistrationTasksFactory.computeUserRegistration,
  computeUserRegistrationApprove: computeUserRegistrationApproveOperation.computeUserRegistrationApprove,
  computeUserRegistrationReject: computeUserRegistrationRejectOperation.computeUserRegistrationReject,
})
