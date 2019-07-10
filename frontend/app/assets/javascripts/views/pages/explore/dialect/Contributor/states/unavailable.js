import React from 'react'
import { PropTypes } from 'react'
const { string, object } = PropTypes
export class ContributorStateUnavailable extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
  }
  static defaultProps = {
    className: 'FormRecorder',
    copy: {},
  }
  render() {
    const { className, copy } = this.props
    return <div className={`${className} Contributor Contributor--unavailable`}>{copy.loading}</div>
  }
}

export default ContributorStateUnavailable
