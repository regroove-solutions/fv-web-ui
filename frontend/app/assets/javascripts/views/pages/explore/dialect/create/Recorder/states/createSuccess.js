import React from 'react'
import copy from '../internationalization'

import { PropTypes } from 'react'
const { string, object, func } = PropTypes
export class RecorderStatesCreateSuccess extends React.Component {
  static propTypes = {
    className: string,
    formData: object,
    handleClick: func,
  }
  static defaultProps = {
    className: 'FormRecorder',
  }
  render() {
    const { className, formData, handleClick } = this.props

    const name = formData['dc:title']
    const description = formData['dc:description']
    return (
      <div className={className}>
        <h1>{copy.success.title}</h1>
        <p>{copy.success.review}</p>
        <dl>
          <dt>{name || copy.success.noName}</dt>
          <dd>{description || ''}</dd>
        </dl>
        <p>{copy.success.thanks}</p>
        <a
          href={window.location.pathname}
          onClick={(e) => {
            e.preventDefault()
            handleClick()
          }}
        >
          {copy.success.createAnother}
        </a>
      </div>
    )
  }
}

export default RecorderStatesCreateSuccess
