import RESTActions from 'providers/rest-actions'

export const queryPage = RESTActions.query('FV_PAGE', 'FVPage', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const createPage = RESTActions.create('FV_PAGE', 'FVPage', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const updatePage = RESTActions.update('FV_PAGE', 'FVPage', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const deletePage = RESTActions.delete('FV_PAGE', 'FVPage', {})

export const publishPage = RESTActions.execute('FV_PAGE_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const askToPublishPage = RESTActions.execute('FV_PAGE_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const unpublishPage = RESTActions.execute('FV_PAGE_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const askToUnpublishPage = RESTActions.execute('FV_PAGE_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const enablePage = RESTActions.execute('FV_PAGE_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const askToEnablePage = RESTActions.execute('FV_PAGE_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const disablePage = RESTActions.execute('FV_PAGE_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})

export const askToDisablePage = RESTActions.execute('FV_PAGE_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions' },
})
