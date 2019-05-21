import RESTActions from 'providers/rest-actions'

export const approveTask = RESTActions.execute('FV_USER_TASKS_APPROVE', 'WorkflowTask.Complete', {
  headers: { 'enrichers.document': 'ancestry' },
})

export const rejectTask = RESTActions.execute('FV_USER_TASKS_REJECT', 'WorkflowTask.Complete', {
  headers: { 'enrichers.document': 'ancestry' },
})

export const approveRegistration = RESTActions.execute('FV_USER_REGISTRATION_APPROVE', 'User.ApproveInvite', {})

export const rejectRegistration = RESTActions.execute('FV_USER_REGISTRATION_REJECT', 'User.RejectInvite', {})

export const fetchTasks = RESTActions.execute('FV_TASKS', 'Workflow.GetOpenTasks')

export const fetchUserTasks = RESTActions.execute('FV_USER_TASKS', 'Task.GetAssigned')

export const fetchUserRegistrationTasks = RESTActions.execute('FV_USER_REGISTRATION', 'FVGetPendingUserRegistrations')

export const countTotalTasks = RESTActions.execute('FV_COUNT_TOTAL_TASKS', 'Repository.ResultSetQuery')
