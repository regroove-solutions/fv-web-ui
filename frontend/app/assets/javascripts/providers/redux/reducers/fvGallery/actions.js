import { create, _delete, execute, fetch, query, update } from 'providers/redux/reducers/rest'

export const fetchGallery = fetch('FV_GALLERY', 'FVGallery', {
  headers: { 'enrichers.document': 'ancestry,gallery,permissions' },
})
export const fetchGalleries = query('FV_GALLERIES', 'FVGallery', {
  headers: { 'enrichers.document': 'ancestry,gallery,permissions' },
})
export const createGallery = create('FV_GALLERY', 'FVGallery', {
  headers: { 'enrichers.document': 'ancestry,gallery,permissions' },
})
export const updateGallery = update(
  'FV_GALLERY',
  'FVGallery',
  { headers: { 'enrichers.document': 'ancestry,gallery,permissions' } },
  false
)
export const deleteGallery = _delete('FV_GALLERY', 'FVGallery', {})

export const publishGallery = execute('FV_GALLERY_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const askToPublishGallery = execute('FV_GALLERY_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const unpublishGallery = execute('FV_GALLERY_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const askToUnpublishGallery = execute('FV_GALLERY_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const enableGallery = execute('FV_GALLERY_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const askToEnableGallery = execute('FV_GALLERY_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const disableGallery = execute('FV_GALLERY_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
export const askToDisableGallery = execute('FV_GALLERY_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,gallery' },
})
