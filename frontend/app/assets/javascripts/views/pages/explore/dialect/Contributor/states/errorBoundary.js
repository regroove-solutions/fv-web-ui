import React from 'react'
import { PropTypes } from 'react'
const { string, object } = PropTypes
export class ContributorStateErrorBoundary extends React.Component {
  static propTypes = {
    className: string,
    errorMessage: string,
    copy: object,
  }
  static defaultProps = {
    className: '',
    copy: {
      errorBoundary: {},
    },
  }
  render() {
    const { className, copy, errorMessage } = this.props
    const contents = errorMessage ? (
      <div>{errorMessage}</div>
    ) : (
      <div>
        <p>{copy.errorBoundary.explanation}</p>
        <p>{copy.errorBoundary.optimism}</p>
      </div>
    )
    return (
      <div className={`${className} Contributor Contributor--errorBoundary`}>
        <h1>{copy.errorBoundary.title}</h1>
        {contents}
      </div>
    )
  }
}

export default ContributorStateErrorBoundary
