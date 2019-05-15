export * from './actions'
export * from './actionTypes'
export * from './reducer'

// import ConfGlobal from 'conf/local.json'

// // Middleware
// import thunk from 'redux-thunk'

// const mockRequest = {
//   fetchDialect2: {
//     // args PathOrId + type of document
//     args: [ConfGlobal.testData.sectionOrWorkspaces + ConfGlobal.testData.dialectPath, 'FVDialect'],
//     evaluateResults: (response) => {
//       return response.type == 'FVDialect' && response.properties != null
//     },
//   },
//   queryDialect2ByShortURL: {
//     // args PathOrId + type of document
//     args: [
//       ConfGlobal.testData.sectionOrWorkspaces,
//       'FVDialect',
//       " AND (fvdialect:short_url = '" +
//         ConfGlobal.testData.dialect['fvdialect:short_url'] +
//         "' OR ecm:name = '') AND ecm:isTrashed = 0 AND ecm:isCheckedInVersion = 0 AND ecm:isProxy = 0",
//     ],
//     evaluateResults: (response) => {
//       return response.totalSize > 0
//     },
//   },
//   fetchDialects: {
//     // args PathOrId + type of document
//     args: [ConfGlobal.testData.sectionOrWorkspaces + ConfGlobal.testData.languagePath, 'FVDialect'],
//     evaluateResults: (response) => {
//       return response.totalSize > 0
//     },
//   },
// }

// const middleware = [thunk]

// export default { middleware, mockRequest }
