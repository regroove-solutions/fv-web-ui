import React from 'react'
import { PropTypes } from 'react'
const { string } = PropTypes

export default class File extends React.Component {
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
  //   fileInput = React.createRef()

  state = {
    files: [],
  }

  render() {
    // if (this.refs.inputFile) {
    //   console.log('!!!', this.refs.inputFile.files)
    // }
    const { className, ariaDescribedby, id, labelText, name } = this.props
    return (
      <div className={`${className} File`}>
        <label className={`${className}__label File__label`} htmlFor={id}>
          {labelText}
        </label>
        <input
          aria-describedby={ariaDescribedby}
          className={`${className}__text File__input`}
          id={id}
          name={name}
          onChange={this.handleChange}
          //   ref={this.fileInput}
          ref="inputFile" // TODO: UPDATE WHEN ON NEW REACT
          type="file"
        />
      </div>
    )
  }
  handleChange = () => {
    this.setState({ files: this.fileInput ? this.fileInput.files : this.state.files })
  }
}
