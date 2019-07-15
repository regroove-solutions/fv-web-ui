import React from 'react'
import { PropTypes } from 'react'

import ContributorCreate from 'views/pages/explore/dialect/Contributor/create'
import validator from './validator'
import internationalization from './internationalization'
const { string } = PropTypes

export default class RecorderCreate extends React.Component {
  static propTypes = {
    className: string,
  }
  static defaultProps = {
    className: 'FormRecorder',
  }

  render() {
    return <ContributorCreate className={this.props.className} validator={validator} copy={internationalization} />
  }
}
