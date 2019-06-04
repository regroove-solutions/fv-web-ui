import React from 'react'
import { PropTypes } from 'react'
const { string, func, object } = PropTypes

export default class File extends React.Component {
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
    files: [],
  }

  fileInput = null
  setFileInputRef = (element) => {
    this.fileInput = element
  }

  render() {
    const { message } = this.props.error
    const { className, ariaDescribedby, id, labelText, name } = this.props
    return (
      <div className={`${className} File ${message && 'Form__error'}`}>
        <label className={`${className}__label File__label`} htmlFor={id}>
          {labelText}
        </label>
        <input
          aria-describedby={ariaDescribedby}
          className={`${className}__text File__input`}
          id={id}
          name={name}
          onChange={() => {
            this._handleChange()
          }}
          ref={this.setFileInputRef}
          type="file"
          multiple
        />
        {message && (
          <label className="Form__errorMessage" htmlFor={id}>
            {message}
          </label>
        )}
      </div>
    )
  }
  _handleChange = () => {
    this.setState({ files: this.fileInput.files }, () => {
      this.props.handleChange(this.state.files)
    })
  }
}
