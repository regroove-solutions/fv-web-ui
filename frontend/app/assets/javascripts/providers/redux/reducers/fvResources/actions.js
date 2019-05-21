import RESTActions from 'providers/rest-actions'

export const fetchResource = RESTActions.fetch('FV_RESOURCE', 'FVPicture,FVAudio,FVVideo', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const fetchResources = RESTActions.query('FV_RESOURCES', 'FVPicture,FVAudio,FVVideo', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const updateResource = RESTActions.update(
  'FV_RESOURCE',
  'FVPicture,FVAudio,FVVideo',
  { headers: { 'enrichers.document': 'ancestry,media,permissions' } },
  false
)

export const publishResource = RESTActions.execute('FV_RESOURCE_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const askToPublishResource = RESTActions.execute('FV_RESOURCE_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const unpublishResource = RESTActions.execute('FV_RESOURCE_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const askToUnpublishResource = RESTActions.execute('FV_RESOURCE_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const enableResource = RESTActions.execute('FV_RESOURCE_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const askToEnableResource = RESTActions.execute('FV_RESOURCE_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const disableResource = RESTActions.execute('FV_RESOURCE_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
export const askToDisableResource = RESTActions.execute('FV_RESOURCE_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,media,permissions' },
})
