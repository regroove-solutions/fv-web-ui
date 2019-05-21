import RESTActions from 'providers/rest-actions'
import RESTReducers from 'providers/rest-reducers'

// Middleware
import thunk from 'redux-thunk'

const queryPage = RESTActions.query('FV_PAGE', 'FVPage', { headers: { 'enrichers.document': 'ancestry,permissions' } })
const createPage = RESTActions.create('FV_PAGE', 'FVPage', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
const updatePage = RESTActions.update('FV_PAGE', 'FVPage', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
const deletePage = RESTActions.delete('FV_PAGE', 'FVPage', {})

const publishPage = RESTActions.execute('FV_PAGE_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
const askToPublishPage = RESTActions.execute('FV_PAGE_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
const unpublishPage = RESTActions.execute('FV_PAGE_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
const askToUnpublishPage = RESTActions.execute('FV_PAGE_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
const enablePage = RESTActions.execute('FV_PAGE_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
const askToEnablePage = RESTActions.execute('FV_PAGE_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
const disablePage = RESTActions.execute('FV_PAGE_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
const askToDisablePage = RESTActions.execute('FV_PAGE_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

const computePageQueryFactory = RESTReducers.computeQuery('page')
const computePageDeleteFactory = RESTReducers.computeDelete('delete_page')
const computePageEnableOperationFactory = RESTReducers.computeOperation('page_enable_workflow')
const computePageDisableOperationFactory = RESTReducers.computeOperation('page_disable_workflow')

const actions = {
  queryPage,
  createPage,
  deletePage,
  updatePage,
  publishPage,
  askToPublishPage,
  unpublishPage,
  askToUnpublishPage,
  enablePage,
  askToEnablePage,
  disablePage,
  askToDisablePage,
}

const reducers = {
  computePage: computePageQueryFactory.computePage,
  computeDeletePage: computePageDeleteFactory.computeDeletePage,
  computePageEnableWorkflow: computePageEnableOperationFactory.computePageEnableWorkflow,
  computePageDisableWorkflow: computePageDisableOperationFactory.computePageDisableWorkflow,
}

const mockRequest = {
  queryPage: {
    // args PathOrId + type of document
    args: ['/FV/sections/Site/Resources/', 'FVPage', " AND fvpage:url LIKE '/home/'&sortOrder=ASC&sortBy=dc:title"],
    evaluateResults: function(response) {
      return response.entries.length === 1 && response.entries[0].properties != null
    },
  },
}

const middleware = [thunk]

export default { actions, reducers, middleware, mockRequest }
