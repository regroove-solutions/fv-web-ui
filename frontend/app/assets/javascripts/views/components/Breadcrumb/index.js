/*
    Old system:
    Home → Explore → Alqonquin → Mi'kmaw → Mi'kmaw → Learn → Words

    New release:
    Mi’kmaw Home Page → Learn → Words
*/
import React, { Component } from 'react'
import { PropTypes } from 'react'
import provide from 'react-redux-provide'
import { Link } from 'provide-page'
import Immutable from 'immutable'
import IntlService from 'views/services/intl'
import { matchPath } from 'conf/routes'

const { array, string, object } = PropTypes

const intl = IntlService.instance
const REMOVE_FROM_BREADCRUMBS = ['FV', 'sections', 'Data', 'Workspaces', 'search', 'nuxeo', 'app', 'explore']

export class Breadcrumb extends Component {
  static propTypes = {
    className: string,
    findReplace: object, // Note: {find: '', replace: ''}
    routeParams: object,
    matchedPage: object, // Note: Immutable Obj
    splitWindowPath: array,
    routes: object, // Note: Immutable Obj
  }
  static defaultProps = {
    className: '',
    routeParams: {},
    matchedPage: Immutable.fromJS({}),
    splitWindowPath: [],
    routes: Immutable.fromJS({}),
  }

  //   constructor(props) {
  //     super(props)
  //     ;['_generateTiles', '_generateDialectFilterUrl', '_handleHistoryEvent'].forEach(
  //       (method) => (this[method] = this[method].bind(this))
  //     )
  //   }
  // const {dialect_name: dialect, language_family_name: languageFamily, language_name: language} = routeParams
  // console.log('!!!', `${dialect} Home Page`)
  render() {
    const content = this._renderBreadcrumb()
    return content
  }
  _renderBreadcrumb() {
    const { matchedPage, findReplace, routeParams, splitWindowPath, routes } = this.props
    // console.log('!!!', {
    //   matchedPage: JSON.stringify(matchedPage.toJS()),
    //   findReplace: JSON.stringify(findReplace),
    //   routeParams: JSON.stringify(routeParams),
    //   splitWindowPath: JSON.stringify(splitWindowPath),
    // })
    // Note: `splitPath` could be the `splitWindowPath` prop or what is returned from `breadcrumbPathOverride()`,
    //       `breadcrumbPathOverride` is an optional property on a route item, typically added via `addPagination()`
    let splitPath = splitWindowPath
    const breadcrumbPathOverride = matchedPage.get('breadcrumbPathOverride')
    if (breadcrumbPathOverride) {
      splitPath = breadcrumbPathOverride(splitPath)
    }

    // Figure out the index of the Dialect in splitPath
    let indexDialect = -1
    if (routeParams.dialect_path) {
      const dialectPathSplit = routeParams.dialect_path.split('/').filter((path) => {
        return path !== ''
      })
      const indexFV = splitPath.indexOf('FV')
      indexDialect = indexFV !== -1 ? indexFV + dialectPathSplit.length - 1 : -1
    }

    const breadcrumbs = splitPath.map((splitPathItem, splitPathIndex) => {
      if (
        splitPathItem &&
        splitPathItem !== '' &&
        REMOVE_FROM_BREADCRUMBS.indexOf(splitPathItem) === -1 &&
        splitPathIndex >= indexDialect // Omits Language and Language Family from breadcrumb
      ) {
        let pathTitle = splitPathItem

        if (findReplace) {
          pathTitle = splitPathItem.replace(findReplace.find, findReplace.replace)
        }

        const DialectHomePage = splitPathIndex === indexDialect ? intl.trans('home_page', 'Home Page') : ''

        // Last element (i.e. current page)
        if (splitPathIndex === splitPath.length - 1) {
          return (
            <li key={splitPathIndex} className="active">
              {`${decodeURIComponent(pathTitle)} ${DialectHomePage}`}
            </li>
          )
        }
        let hrefPath = '/' + splitPath.slice(0, splitPathIndex + 1).join('/')

        /**
         * Replace breadcrumb entry with redirect value. Solved some rendering issues. Needs more robust solution though.
         */
        // PSUEDO: check each route
        routes.forEach((value) => {
          // PSUEDO: compare route path with breadcrumb path
          const matchTest = matchPath(value.get('path'), [splitPathItem])

          if (matchTest.matched) {
            /* PSUEDO: A route entry can have a `redirects` prop that will be used to update `hrefPath`
            eg:
            redirects: [{
              condition: ({
                props: {computeLogin, splitWindowPath}
              })=>{},
              target: ({
                props: {splitWindowPath}
              })=>{}
            }],

            */
            if (value.has('redirects')) {
              value.get('redirects').forEach((redirectValue) => {
                if (redirectValue.get('condition')({ props: this.props })) {
                  hrefPath = redirectValue.get('target')({ props: this.props })
                  hrefPath = hrefPath.replace('sections', routeParams.area || splitPath[2] || 'sections')

                  return false
                }
              })
            }

            // Break out of forEach
            return false
          }
        })

        return (
          <li key={splitPathIndex}>
            <Link key={splitPathIndex} href={hrefPath}>
              {`${intl.searchAndReplace(decodeURIComponent(pathTitle).replace('&amp;', '&'))} ${DialectHomePage}`}
            </Link>
          </li>
        )
      }
    })
    return <ul className={`Breadcrumb breadcrumb fontAboriginalSans ${this.props.className}`}>{breadcrumbs}</ul>
  }
}

export default provide(Breadcrumb)
