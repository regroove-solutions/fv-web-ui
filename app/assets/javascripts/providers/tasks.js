import RESTActions from './rest-actions'
import RESTReducers from './rest-reducers'

//Middleware
import thunk from 'redux-thunk';

// Operations
import UserOperations from 'operations/UserOperations';

const approveTask = RESTActions.execute('FV_USER_TASKS_APPROVE', 'WorkflowTask.Complete', { headers: { 'X-NXenrichers.document': 'ancestry' } });
const rejectTask = RESTActions.execute('FV_USER_TASKS_REJECT', 'WorkflowTask.Complete', { headers: { 'X-NXenrichers.document': 'ancestry' } });

const fetchTasks = RESTActions.execute('FV_TASKS', 'Workflow.GetOpenTasks');
const fetchUserTasks = RESTActions.execute('FV_USER_TASKS', 'Task.GetAssigned');

const actions = { fetchTasks, fetchUserTasks, approveTask, rejectTask };

const computeUserTasksOperation = RESTReducers.computeOperation('user_tasks');
const computeTasksOperation = RESTReducers.computeOperation('tasks');
const computeUserTasksApproveOperation = RESTReducers.computeOperation('user_tasks_approve');
const computeUserTasksRejectOperation = RESTReducers.computeOperation('user_tasks_reject');

const reducers = {
	computeTasks: computeTasksOperation.computeTasks,
	computeUserTasks: computeUserTasksOperation.computeUserTasks,
	computeUserTasksApprove: computeUserTasksApproveOperation.computeUserTasksApprove,
	computeUserTasksReject: computeUserTasksRejectOperation.computeUserTasksReject
};

const middleware = [thunk];

export default { actions, reducers, middleware };