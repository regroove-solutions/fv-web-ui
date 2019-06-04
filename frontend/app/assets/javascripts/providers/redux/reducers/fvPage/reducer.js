import { computeQuery, computeDelete, computeOperation } from 'providers/redux/reducers/rest'
import { combineReducers } from 'redux'

const computePageQueryFactory = computeQuery('page')
const computePageDeleteFactory = computeDelete('delete_page')
const computePageEnableOperationFactory = computeOperation('page_enable_workflow')
const computePageDisableOperationFactory = computeOperation('page_disable_workflow')

export const fvPageReducer = combineReducers({
  computePage: computePageQueryFactory.computePage,
  computeDeletePage: computePageDeleteFactory.computeDeletePage,
  computePageEnableWorkflow: computePageEnableOperationFactory.computePageEnableWorkflow,
  computePageDisableWorkflow: computePageDisableOperationFactory.computePageDisableWorkflow,
})
