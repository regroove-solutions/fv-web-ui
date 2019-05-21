import RESTReducers from 'providers/rest-reducers'
import { combineReducers } from 'redux'

const computePageQueryFactory = RESTReducers.computeQuery('page')
const computePageDeleteFactory = RESTReducers.computeDelete('delete_page')
const computePageEnableOperationFactory = RESTReducers.computeOperation('page_enable_workflow')
const computePageDisableOperationFactory = RESTReducers.computeOperation('page_disable_workflow')

export const fvPageReducer = combineReducers({
  computePage: computePageQueryFactory.computePage,
  computeDeletePage: computePageDeleteFactory.computeDeletePage,
  computePageEnableWorkflow: computePageEnableOperationFactory.computePageEnableWorkflow,
  computePageDisableWorkflow: computePageDisableOperationFactory.computePageDisableWorkflow,
})
