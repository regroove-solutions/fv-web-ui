import React from 'react'
import { PropTypes } from 'react'
const { string, func, object } = PropTypes

export default class Textarea extends React.Component {
  static defaultProps = {
    className: 'Textarea',
    value: '',
    handleChange: () => {},
    error: {},
    setRef: () => {},
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
    setRef: func,
  }

  state = {
    value: this.props.value,
  }

  render() {
    const { message } = this.props.error
    const { ariaDescribedby, className, id, labelText, name, setRef } = this.props
    return (
      <div className={`${className} Textarea ${message && 'Form__error'}`}>
        <label className={`${className}__label Textarea__label`} htmlFor={id}>
          {labelText}
        </label>
        <textarea
          aria-describedby={ariaDescribedby}
          className={`${className}__textarea Textarea__textarea`}
          id={id}
          name={name}
          defaultValue={this.state.value}
          onChange={this._handleChange}
          ref={setRef}
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
