import React from 'react'
import { PropTypes } from 'react'

// REDUX
import { connect } from 'react-redux'

import Contributors from 'views/pages/explore/dialect/Contributors'
import internationalization from './internationalization'
const { object, string } = PropTypes

export class Recorders extends React.Component {
  static propTypes = {
    className: string,
    // REDUX: reducers/state
    routeParams: object.isRequired,
  }
  static defaultProps = {
    className: 'FormRecorder',
  }

  render() {
    const { routeParams } = this.props
    const { theme, dialect_path } = routeParams
    const editUrl = `/${theme}${dialect_path}/edit/recorder/`
    return <Contributors className={this.props.className} copy={internationalization} editUrl={editUrl} />
  }
}
// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { navigation } = state

  const { route } = navigation

  return {
    routeParams: route.routeParams,
  }
}

export default connect(
  mapStateToProps,
  null
)(Recorders)
