/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable, { Map } from 'immutable'

import { Table, TableHead, TableBody, TableCell, TableRow, TableFooter, IconButton } from '@material-ui/core'
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@material-ui/icons'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchLabels } from 'providers/redux/reducers/fvLabel'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'

import selectn from 'selectn'
import IntlService from 'views/services/intl'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import ProviderHelpers from 'common/ProviderHelpers'
const intl = IntlService.instance

import ImmersionTable from 'views/components/ImmersionTable'

/**
 * List view for words in immersion
 */
const { array, bool, func, number, object, string } = PropTypes

class TablePaginationActions extends React.Component {
  static propTypes = {
    classes: object.isRequired,
    count: number.isRequired,
    onChangePage: func.isRequired,
    page: number.isRequired,
    rowsPerPage: number.isRequired,
    theme: object.isRequired,
  }

  handleFirstPageButtonClick = (event) => {
    this.props.onChangePage(event, 0)
  }

  handleBackButtonClick = (event) => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  handleNextButtonClick = (event) => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  handleLastPageButtonClick = (event) => {
    this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1))
  }

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props

    return (
      <div className={classes.root}>
        <IconButton onClick={this.handleFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
          {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton onClick={this.handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
        </IconButton>
      </div>
    )
  }
}

class ImmersionListView extends Component {
  static propTypes = {
    parentID: string,
    routeParams: object.isRequired,
    allLabels: array,
    allCategories: array,
    urlPageNumber: number,
    urlPageSize: number,

    // // Search
    // // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLabels: object.isRequired,
    fetchDialect2: func.isRequired,
    fetchLabels: func.isRequired,
  }
  static defaultProps = {}

  constructor(props, context) {
    super(props, context)

    this.state = {
      mappedTranslations: null,
    }
  }

  componentDidMount() {
    this.fetchData(this.props)
    this.mapTranslatedLabels()
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.computeLabels !== prevProps.computeLabels ||
      this.props.allLabels.length !== prevProps.allLabels.length ||
      this.props.allCategories.length !== prevProps.allCategories.length
    ) {
      this.mapTranslatedLabels()
    }
  }

  _getPathOrParentID = (newProps) => {
    return newProps.parentID ? newProps.parentID : `${newProps.routeParams.dialect_path}/Label Dictionary`
  }

  getDialect(props = this.props) {
    return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path)
  }

  fetchData(newProps) {
    if (newProps.dialect === null && !this.getDialect(newProps)) {
      newProps.fetchDialect2(newProps.routeParams.dialect_path)
    }
    newProps.fetchLabels(this._getPathOrParentID(newProps), '')
  }

  mapTranslatedLabels() {
    const { allLabels, allCategories, computeLabels } = this.props
    const computedLabels = ProviderHelpers.getEntry(computeLabels, this._getPathOrParentID(this.props))
    const translatedLabels = selectn('response.entries', computedLabels)

    if (allLabels.length === 0 || !translatedLabels || allCategories.length === 0) {
      this.setState({ mappedTranslations: null })
      return
    }
    const mappedLabels = allLabels.map((v) => {
      const label = {
        labelKey: v.id,
        type: v.type,
        templateStrings: v.template_strings,
        categoryId: v.category,
        base: intl.translate({ key: v.id, default: 'Translated Label', case: 'first' }),
      }
      const translatedLabel = translatedLabels.find((l) => {
        return l.properties['fvlabel:labelKey'] === v.id
      })
      label.translation = translatedLabel ? translatedLabel.properties['dc:title'] : undefined
      const category = allCategories.find((c) => {
        return c.id === v.category
      })
      label.category = category ? category.label : undefined
      return label
    })
    this.setState({ mappedTranslations: mappedLabels })
    return
  }

  render() {
    const { mappedTranslations } = this.state

    const computeEntities = Immutable.fromJS([
      {
        id: this._getPathOrParentID(this.props),
        entity: this.props.computeLabels,
      },
    ])
    // If dialect not supplied, promise wrapper will need to wait for compute dialect
    if (!this.props.dialect) {
      computeEntities.push(
        new Map({
          id: this.props.routeParams.dialect_path,
          entity: this.props.computeDialect2,
        })
      )
    }

    const computeDialect2 = this.props.dialect || this.getDialect()

    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        {!mappedTranslations ? 'Loading...' : <ImmersionTable mappedTranslations={mappedTranslations} />}
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvLabel } = state

  const { computeLabels } = fvLabel
  const { computeDialect2 } = fvDialect

  return {
    computeDialect2,
    computeLabels,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchLabels,
  fetchDialect2,
}

export default connect(mapStateToProps, mapDispatchToProps)(ImmersionListView)
