import React from 'react'
import { PropTypes } from 'react'
const { string, element } = PropTypes

export default class Text extends React.Component {
  static defaultProps = {
    className: 'Text',
    value: undefined,
  }

  static propTypes = {
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    className: string,
    ariaDescribedby: string,
    value: string,
    children: element,
  }

  state = {
    value: this.props.value,
  }

  render() {
    const { className, ariaDescribedby, id, labelText, name } = this.props
    return (
      <div className={`${className} Select`}>
        <label className={`${className}__label Select__label`} htmlFor={id}>
          {labelText}
        </label>
        <select
          aria-describedby={ariaDescribedby}
          className={`${className}__select Select__select`}
          id={id}
          name={name}
          defaultValue={this.state.value}
          onChange={this.handleChange}
        >
          {this.props.children}
        </select>
      </div>
    )
  }
  handleChange = (event) => {
    this.setState({ value: event.target.value })
  }
}
