import React from 'react'
import copy from '../internationalization'
import { PropTypes } from 'react'
const { string } = PropTypes
export class RecorderStatesUnavailable extends React.Component {
  static propTypes = {
    className: string,
  }
  static defaultProps = {
    className: 'FormRecorder',
  }
  render() {
    return <div className={this.props.className}>{copy.loading}</div>
  }
}

export default RecorderStatesUnavailable
