import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'

// import { createLogger } from 'redux-logger'
// const loggerMiddleware = createLogger()

export default createStore(
  rootReducer /* preloadedState, */,
  compose(
    applyMiddleware(
      thunkMiddleware // lets us dispatch() functions
      // loggerMiddleware // log actions
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)
