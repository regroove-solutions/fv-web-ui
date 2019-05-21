import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

const computeResourceFetchFactory = RESTReducers.computeFetch('resource')
const computeResourcesQueryFactory = RESTReducers.computeQuery('resources')
const computeResourceEnableOperationFactory = RESTReducers.computeOperation('resource_enable_workflow')
const computeResourceDisableOperationFactory = RESTReducers.computeOperation('resource_disable_workflow')

export const fvResourcesReducer = combineReducers({
  computeResource: computeResourceFetchFactory.computeResource,
  computeResources: computeResourcesQueryFactory.computeResources,
  computeResourceEnableWorkflow: computeResourceEnableOperationFactory.computeResourceEnableWorkflow,
  computeResourceDisableWorkflow: computeResourceDisableOperationFactory.computeResourceDisableWorkflow,
})
