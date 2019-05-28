import { computeFetch, computeOperation, computeQuery } from 'providers/redux/reducers/rest'
import { combineReducers } from 'redux'

const computeResourceFetchFactory = computeFetch('resource')
const computeResourcesQueryFactory = computeQuery('resources')
const computeResourceEnableOperationFactory = computeOperation('resource_enable_workflow')
const computeResourceDisableOperationFactory = computeOperation('resource_disable_workflow')

export const fvResourcesReducer = combineReducers({
  computeResource: computeResourceFetchFactory.computeResource,
  computeResources: computeResourcesQueryFactory.computeResources,
  computeResourceEnableWorkflow: computeResourceEnableOperationFactory.computeResourceEnableWorkflow,
  computeResourceDisableWorkflow: computeResourceDisableOperationFactory.computeResourceDisableWorkflow,
})
