import RESTActions from 'providers/rest-actions'

export const fetchGallery = RESTActions.fetch('FV_GALLERY', 'FVGallery', {
  headers: { 'enrichers.document': 'ancestry,gallery,permissions' },
})
export const fetchGalleries = RESTActions.query('FV_GALLERIES', 'FVGallery', {
  headers: { 'enrichers.document': 'ancestry,gallery,permissions' },
})
export const createGallery = RESTActions.create('FV_GALLERY', 'FVGallery', {
  headers: { 'enrichers.document': 'ancestry,gallery,permissions' },
})
export const updateGallery = RESTActions.update(
  'FV_GALLERY',
  'FVGallery',
  { headers: { 'enrichers.document': 'ancestry,gallery,permissions' } },
  false
)
export const deleteGallery = RESTActions.delete('FV_GALLERY', 'FVGallery', {})

export const publishGallery = RESTActions.execute('FV_GALLERY_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const askToPublishGallery = RESTActions.execute('FV_GALLERY_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const unpublishGallery = RESTActions.execute('FV_GALLERY_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const askToUnpublishGallery = RESTActions.execute('FV_GALLERY_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const enableGallery = RESTActions.execute('FV_GALLERY_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const askToEnableGallery = RESTActions.execute('FV_GALLERY_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const disableGallery = RESTActions.execute('FV_GALLERY_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const askToDisableGallery = RESTActions.execute('FV_GALLERY_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
