import RESTActions from 'providers/rest-actions'
import DirectoryOperations from 'operations/DirectoryOperations'

import {
  FV_BOOKS_SHARED_FETCH_START,
  FV_BOOKS_SHARED_FETCH_SUCCESS,
  FV_BOOKS_SHARED_FETCH_ERROR,
  FV_BOOK_FETCH_ALL_START,
  FV_BOOK_FETCH_ALL_SUCCESS,
  FV_BOOK_FETCH_ALL_ERROR,
  FV_STORIES_USER_MODIFIED_QUERY_START,
  FV_STORIES_USER_MODIFIED_QUERY_SUCCESS,
  FV_STORIES_USER_MODIFIED_QUERY_ERROR,
  FV_STORIES_USER_CREATED_QUERY_START,
  FV_STORIES_USER_CREATED_QUERY_SUCCESS,
  FV_STORIES_USER_CREATED_QUERY_ERROR,
  FV_SONGS_USER_MODIFIED_QUERY_START,
  FV_SONGS_USER_MODIFIED_QUERY_SUCCESS,
  FV_SONGS_USER_MODIFIED_QUERY_ERROR,
  FV_SONGS_USER_CREATED_QUERY_START,
  FV_SONGS_USER_CREATED_QUERY_SUCCESS,
  FV_SONGS_USER_CREATED_QUERY_ERROR,
} from './actionTypes'

export const fetchSharedBooks = (page_provider, headers = {}, params = {}) => {
  return (dispatch) => {
    dispatch({ type: FV_BOOKS_SHARED_FETCH_START })

    return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVBook', headers, params)
      .then((response) => {
        dispatch({ type: FV_BOOKS_SHARED_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_BOOKS_SHARED_FETCH_ERROR, error: error })
      })
  }
}

export const fetchBooksAll = (path /*, type*/) => {
  return (dispatch) => {
    dispatch({ type: FV_BOOK_FETCH_ALL_START })

    return DirectoryOperations.getDocuments(path, 'FVBook', '', {
      headers: { 'enrichers.document': 'ancestry,permissions,book' },
    })
      .then((response) => {
        dispatch({ type: FV_BOOK_FETCH_ALL_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_BOOK_FETCH_ALL_ERROR, error: error })
      })
  }
}

export const fetchBook = RESTActions.fetch('FV_BOOK', 'FVBook', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const fetchBooks = RESTActions.query('FV_BOOKS', 'FVBook', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const createBook = RESTActions.create('FV_BOOK', 'FVBook', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const updateBook = RESTActions.update(
  'FV_BOOK',
  'FVBook',
  { headers: { 'enrichers.document': 'ancestry,permissions,book' } },
  false
)
export const deleteBook = RESTActions.delete('FV_BOOK', 'FVBook', {})

export const publishBook = RESTActions.execute('FV_BOOK_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const askToPublishBook = RESTActions.execute('FV_BOOK_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const unpublishBook = RESTActions.execute('FV_BOOK_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const askToUnpublishBook = RESTActions.execute('FV_BOOK_UNPUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const enableBook = RESTActions.execute('FV_BOOK_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const askToEnableBook = RESTActions.execute('FV_BOOK_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const disableBook = RESTActions.execute('FV_BOOK_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const askToDisableBook = RESTActions.execute('FV_BOOK_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const fetchBookEntry = RESTActions.fetch('FV_BOOK_ENTRY', 'FVBookEntry', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const createBookEntry = RESTActions.create('FV_BOOK_ENTRY', 'FVBookEntry', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const updateBookEntry = RESTActions.update('FV_BOOK_ENTRY', 'FVBookEntry', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const deleteBookEntry = RESTActions.delete('FV_BOOK_ENTRY', 'FVBookEntry', {})

export const publishBookEntry = RESTActions.execute('FV_BOOK_ENTRY_PUBLISH', 'FVPublish', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const askToPublishBookEntry = RESTActions.execute('FV_BOOK_ENTRY_PUBLISH_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const unpublishBookEntry = RESTActions.execute('FV_BOOK_ENTRY_UNPUBLISH', 'FVUnpublishDialect', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const askToUnpublishBookEntry = RESTActions.execute(
  'FV_BOOK_ENTRY_UNPUBLISH_WORKFLOW',
  'Context.StartWorkflow',
  {
    headers: { 'enrichers.document': 'ancestry,permissions,book' },
  }
)

export const enableBookEntry = RESTActions.execute('FV_BOOK_ENTRY_ENABLE', 'FVEnableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const askToEnableBookEntry = RESTActions.execute('FV_BOOK_ENTRY_ENABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const disableBookEntry = RESTActions.execute('FV_BOOK_ENTRY_DISABLE', 'FVDisableDocument', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const askToDisableBookEntry = RESTActions.execute('FV_BOOK_ENTRY_DISABLE_WORKFLOW', 'Context.StartWorkflow', {
  headers: { 'enrichers.document': 'ancestry,permissions,book' },
})

export const fetchBookEntries = RESTActions.query('FV_BOOK_ENTRIES', 'FVBookEntry', {
  headers: { 'enrichers.document': 'ancestry,book,permissions' },
})

export const queryModifiedStories = RESTActions.query('FV_MODIFIED_STORIES', 'FVBook', {
  queryAppend: " AND fvbook:type='story'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
  headers: { properties: 'dublincore' },
})

export const queryCreatedStories = RESTActions.query('FV_CREATED_STORIES', 'FVBook', {
  queryAppend: " AND fvbook:type='story'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
  headers: { properties: 'dublincore' },
})

export const queryModifiedSongs = RESTActions.query('FV_MODIFIED_SONGS', 'FVBook', {
  queryAppend: " AND fvbook:type='song'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
  headers: { properties: 'dublincore' },
})

export const queryCreatedSongs = RESTActions.query('FV_CREATED_SONGS', 'FVBook', {
  queryAppend: " AND fvbook:type='song'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
  headers: { properties: 'dublincore' },
})

export const queryUserModifiedStories = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_STORIES_USER_MODIFIED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVBook',
      " AND fvbook:type='story' AND dc:lastContributor='" + user + "'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_STORIES_USER_MODIFIED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_STORIES_USER_MODIFIED_QUERY_ERROR, error: error })
      })
  }
}

export const queryUserCreatedStories = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_STORIES_USER_CREATED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVBook',
      " AND fvbook:type='story' AND dc:lastContributor='" + user + "'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_STORIES_USER_CREATED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_STORIES_USER_CREATED_QUERY_ERROR, error: error })
      })
  }
}

export const queryUserModifiedSongs = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_SONGS_USER_MODIFIED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVBook',
      " AND fvbook:type='song' AND dc:lastContributor='" + user + "'&sortBy=dc:modified&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_SONGS_USER_MODIFIED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_SONGS_USER_MODIFIED_QUERY_ERROR, error: error })
      })
  }
}

export const queryUserCreatedSongs = (pathOrId, user) => {
  return (dispatch) => {
    dispatch({ type: FV_SONGS_USER_CREATED_QUERY_START })

    return DirectoryOperations.getDocuments(
      pathOrId,
      'FVBook',
      " AND fvbook:type='song' AND dc:lastContributor='" + user + "'&sortBy=dc:created&sortOrder=DESC&pageSize=4",
      { properties: 'dublincore' }
    )
      .then((response) => {
        dispatch({ type: FV_SONGS_USER_CREATED_QUERY_SUCCESS, document: response })
      })
      .catch((error) => {
        dispatch({ type: FV_SONGS_USER_CREATED_QUERY_ERROR, error: error })
      })
  }
}
