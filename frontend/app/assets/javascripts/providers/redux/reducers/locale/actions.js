import {
  SET_LOCALE, FV_LABELS_FETCH_START,
  FV_LABELS_FETCH_SUCCESS,
  FV_LABELS_FETCH_ERROR
} from './actionTypes'
import DirectoryOperations from 'operations/DirectoryOperations'

export const setLocale = (locale = "") => {
  return (dispatch) => {
    dispatch({ type: SET_LOCALE, payload: locale })
  }
}

export const getWorkspaceLabels = (workspace = "") => {

  function _getImmersiveWords() {
    return DirectoryOperations
      .getDocumentsViaResultSetQuery(workspace, "FVLabel", "dc:title, fvlabel:labelKey")
      .then(result => result.entries.reduce((holder, entry) => {
        const path = entry["fvlabel:labelKey"].split(".");
        let targetRef = holder;
        path.slice(0, -1).forEach(step => {
          if (!targetRef[step]) {
            targetRef[step] = {}
          }
          targetRef = targetRef[step]
        })
        targetRef[path[path.length - 1]] = entry["dc:title"];
        return holder;
      }, {}));
  }

  return (dispatch) => {
    dispatch({ type: FV_LABELS_FETCH_START })

    return _getImmersiveWords()
      .then((labels) => {
        dispatch({
          type: FV_LABELS_FETCH_SUCCESS, payload: {
            labels,
            workspace
          }
        })
      })
      .catch((error) => {
        dispatch({ type: FV_LABELS_FETCH_ERROR, error: error })
      })
  }
}