import React from 'react'
import copy from '../internationalization'
export class RecorderStatesUnavailable extends React.Component {
  render() {
    return (
      <div>
        <h1>{copy.errorBoundary.title}</h1>
        <p>{copy.errorBoundary.explanation}</p>
        <p>{copy.errorBoundary.optimism}</p>
      </div>
    )
  }
}

export default RecorderStatesUnavailable
