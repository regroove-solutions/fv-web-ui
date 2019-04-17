import React from 'react'
import { PropTypes } from 'react'
const { string, bool, func } = PropTypes

export default class Checkbox extends React.Component {
  static defaultProps = {
    className: 'Checkbox',
    value: '',
    handleChange: () => {},
  }

  static propTypes = {
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    ariaDescribedby: string,
    className: string,
    selected: bool,
    handleChange: func,
  }

  state = {
    selected: this.props.selected,
  }

  render() {
    const { className, ariaDescribedby, id, labelText, name } = this.props
    return (
      <div className={`${className} Checkbox`}>
        <input
          aria-describedby={ariaDescribedby}
          className={`${className}__text Checkbox__text`}
          id={id}
          name={name}
          defaultChecked={this.state.selected}
          onChange={this._handleChange}
          type="checkbox"
        />
        <label className={`${className}__label Checkbox__label`} htmlFor={id}>
          {labelText}
        </label>
      </div>
    )
  }
  _handleChange = () => {
    const newValue = !this.state.selected
    this.setState({ selected: newValue }, () => {
      this.handleChange(newValue)
    })
  }
}
