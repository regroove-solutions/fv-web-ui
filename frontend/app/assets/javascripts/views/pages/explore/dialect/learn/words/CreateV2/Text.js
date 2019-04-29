import React from 'react'
import { PropTypes } from 'react'
const { string, func, object } = PropTypes

export default class Text extends React.Component {
  static defaultProps = {
    className: 'Text',
    value: '',
    handleChange: () => {},
    error: {},
  }

  static propTypes = {
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    ariaDescribedby: string,
    className: string,
    value: string,
    handleChange: func,
    error: object,
  }

  state = {
    value: this.props.value,
  }

  render() {
    const { className, ariaDescribedby, id, labelText, name } = this.props
    const { message } = this.props.error
    return (
      <div className={`${className} Text ${message && 'Form__error'}`}>
        <label className="Text__label" htmlFor={id}>
          {labelText}
        </label>
        <input
          aria-describedby={ariaDescribedby}
          className="Text__text"
          id={id}
          name={name}
          defaultValue={this.state.value}
          onChange={this._handleChange}
          type="text"
        />
        {message && (
          <label className="Form__errorMessage" htmlFor={id}>
            {message}
          </label>
        )}
      </div>
    )
  }
  _handleChange = (event) => {
    const value = event.target.value
    this.setState({ value })
    this.props.handleChange(value)
  }
}
