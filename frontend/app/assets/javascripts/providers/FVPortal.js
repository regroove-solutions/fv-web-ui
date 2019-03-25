// Middleware
import thunk from "redux-thunk"

// Operations
import DirectoryOperations from "operations/DirectoryOperations"

import RESTActions from "./rest-actions"
import RESTReducers from "./rest-reducers"

const DISMISS_ERROR = "DISMISS_ERROR"

const FV_FETCH_PORTALS_START = "FV_FETCH_PORTALS_START"
const FV_FETCH_PORTALS_FETCH_SUCCESS = "FV_FETCH_PORTALS_FETCH_SUCCESS"
const FV_FETCH_PORTALS_FETCH_ERROR = "FV_FETCH_PORTALS_FETCH_ERROR"

const updatePortal = RESTActions.update("FV_PORTAL", "FVPortal", {
  headers: { "enrichers.document": "ancestry,portal" },
})
const publishPortal = RESTActions.execute("FV_PORTAL_PUBLISH", "FVPublish", {
  headers: { "enrichers.document": "ancestry,portal" },
})
const unpublishPortal = RESTActions.execute("FV_PORTAL_UNPUBLISH", "FVUnpublishDialect", {
  headers: { "enrichers.document": "ancestry,portal" },
})
const fetchPortal = RESTActions.fetch("FV_PORTAL", "FVPortal", {
  headers: { "enrichers.document": "ancestry,portal" },
})
// const fetchPortals = RESTActions.query("FV_PORTALS", "FVPortal", {
//   page_provider: "get_dialects",
//   headers: { "enrichers.document": "ancestry,portal", "properties": "" },
// })

const fetchPortals = function fetchPortals(page_provider, headers = {}, params = {}) {
  return function(dispatch) {
    dispatch({ type: FV_FETCH_PORTALS_START })

    return DirectoryOperations.getDocumentsViaPageProvider(page_provider, "FVPortal", "", headers, params)
      .then((response) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_SUCCESS, documents: response })
      })
      .catch((error) => {
        dispatch({ type: FV_FETCH_PORTALS_FETCH_ERROR, error: error })
      })
  }
}

const actions = { fetchPortal, fetchPortals, updatePortal, publishPortal, unpublishPortal }

const computePortalQuery = RESTReducers.computeQuery("portals")
const computePortalFactory = RESTReducers.computeFetch("portal")

const reducers = {
  computePortal: computePortalFactory.computePortal,
  //   computePortals: computePortalQuery.computePortals,
  computePortals(
    state = {
      isFetching: false,
      response: {
        get: function() {
          return ""
        },
      },
      success: false,
    },
    action
  ) {
    switch (action.type) {
      case FV_FETCH_PORTALS_START:
        return Object.assign({}, state, { isFetching: true })
        break

      // Send modified document to UI without access REST end-point
      case FV_FETCH_PORTALS_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true })
        break

      // Send modified document to UI without access REST end-point
      case FV_FETCH_PORTALS_FETCH_ERROR:
        return Object.assign({}, state, {
          isFetching: false,
          isError: true,
          error: action.error,
          errorDismissed: action.type === DISMISS_ERROR ? true : false,
        })
        break

      default:
        return Object.assign({}, state, { isFetching: false })
        break
    }
  },
}

const middleware = [thunk]

export default { actions, reducers, middleware }
