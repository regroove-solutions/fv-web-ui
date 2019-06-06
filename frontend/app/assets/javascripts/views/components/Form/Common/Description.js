import React from 'react'
import { PropTypes } from 'react'
const { string } = PropTypes

export default class Description extends React.Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    text: string,
    className: string,
  }

  render() {
    const { className, text } = this.props
    return text && text !== '' ? <div className={`${className} Description alert alert-info`}>{text}</div> : null
  }
}
