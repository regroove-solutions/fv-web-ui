import React from 'react'
import { PropTypes } from 'react'
const { string } = PropTypes

export default class Text extends React.Component {
  static defaultProps = {
    className: 'Text',
    value: '',
  }

  static propTypes = {
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    ariaDescribedby: string,
    className: string,
    value: string,
  }

  state = {
    value: this.props.value,
  }

  render() {
    const { className, ariaDescribedby, id, labelText, name } = this.props
    return (
      <div className={`${className} Text`}>
        <label className={`${className}__label Text__label`} htmlFor={id}>
          {labelText}
        </label>
        <input
          aria-describedby={ariaDescribedby}
          className={`${className}__text Text__text`}
          id={id}
          name={name}
          defaultValue={this.state.value}
          onChange={this.handleChange}
          type="text"
        />
      </div>
    )
  }
  handleChange = (event) => {
    this.setState({ value: event.target.value })
  }
}
