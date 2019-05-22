import { combineReducers } from 'redux'
import { PUSH_WINDOW_PATH, REPLACE_WINDOW_PATH } from './actionTypes'
import { splitPath, canUseDOM } from './helpers'

export const _windowPath = (state = window.location.pathname, action = {}) => {
  switch (action.type) {
    case PUSH_WINDOW_PATH:
      if (canUseDOM) {
        window.history.pushState(action, document.title, action.windowPath)
      }
      return action.windowPath

    case REPLACE_WINDOW_PATH:
      if (canUseDOM) {
        window.history.replaceState(action, document.title, action.windowPath)
      }
      return action.windowPath

    default:
      return state
  }
}

export const splitWindowPath = (state = splitPath(window.location.pathname), action = {}) => {
  switch (action.type) {
    case PUSH_WINDOW_PATH:
    case REPLACE_WINDOW_PATH:
      return action.windowPathSplit

    default:
      return state
  }
}

export const windowPathReducer = combineReducers({
  splitWindowPath,
  _windowPath,
})
