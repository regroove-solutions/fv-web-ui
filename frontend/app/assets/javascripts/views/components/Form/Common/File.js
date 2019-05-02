import React from 'react'
import { PropTypes } from 'react'
const { string, func } = PropTypes

export default class File extends React.Component {
  static defaultProps = {
    className: 'Text',
    value: '',
    handleChange: () => {},
  }

  static propTypes = {
    id: string.isRequired,
    labelText: string.isRequired,
    name: string.isRequired,
    ariaDescribedby: string,
    className: string,
    value: string,
    handleChange: func,
  }
  //   fileInput = React.createRef()

  state = {
    files: [],
  }

  constructor(props) {
    super(props)

    // NOTE: Using callback refs since on old React
    // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    this.fileInput = null

    this.setFileInputRef = (element) => {
      this.fileInput = element
    }
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
          onChange={() => {
            this._handleChange()
          }}
          ref={this.setFileInputRef}
          type="file"
        />
      </div>
    )
  }
  _handleChange = () => {
    this.setState({ files: this.fileInput ? this.fileInput.files[0] : this.state.files }, () => {
      this.props.handleChange(this.state.files)
    })
  }
}
