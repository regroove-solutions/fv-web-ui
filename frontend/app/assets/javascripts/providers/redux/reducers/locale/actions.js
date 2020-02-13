import {
  SET_LOCALE, FV_LABELS_FETCH_START,
  FV_LABELS_FETCH_SUCCESS,
  FV_LABELS_FETCH_ERROR,
  SET_WORKSPACE
} from './actionTypes'
import DirectoryOperations from 'operations/DirectoryOperations'

export const setLocale = (locale = "") => {
  return (dispatch, getState) => {
    if (locale === "immersive" && getState().locale.workspace) {
      getWorkspaceLabels(locale, getState().locale.workspace, dispatch);
    } else {
      dispatch({ type: SET_LOCALE, payload: locale })
    }
  }
}

export const setIntlWorkspace = (workspace = "") => {
  return (dispatch, getState) => {
    if (getState().locale.intlService.locale === "immersive" && workspace) {
      return getWorkspaceLabels(getState().locale.intlService.locale, workspace, dispatch);
    } else {
      dispatch({ type: SET_WORKSPACE, payload: workspace });
    }
  }
}

function getWorkspaceLabels(locale, workspace, dispatch) {

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

  dispatch({ type: FV_LABELS_FETCH_START })

  return _getImmersiveWords()
    .then((labels) => {
      dispatch({
        type: FV_LABELS_FETCH_SUCCESS, payload: {
          labels,
          workspace,
          locale
        }
      })
    })
    .catch((error) => {
      dispatch({ type: FV_LABELS_FETCH_ERROR, error: error })
    })

}