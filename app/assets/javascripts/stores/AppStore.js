import { createStore, applyMiddleware } from 'redux'
//import thunk from 'redux-thunk'
//import api from '../middleware/api'
import rootReducer from '../reducers'

export default function initStore(initialState) {
  return createStore(
    rootReducer,
    initialState/*,
    applyMiddleware(api)*/
  )
}