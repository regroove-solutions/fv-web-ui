import React from 'react'
import { PropTypes } from 'react'

import '!style-loader!css-loader!./Text.css'

const { bool, string, func, object } = PropTypes

export default class Text extends React.Component {
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
    wysiwyg: bool,
  }
  static defaultProps = {
    className: 'Text',
    value: '',
    handleChange: () => {},
    error: {},
    setRef: () => {},
    wysiwyg: false,
  }

  state = {
    value: this.props.value,
    TextElement: null,
  }

  async componentDidMount() {
    const { ariaDescribedby, id, name, setRef } = this.props

    const textComponent = this.props.wysiwyg ? (
      await import(/* webpackChunkName: "Editor" */ 'views/components/Editor').then((_module) => {
        const Editor = _module.default
        return (
          <Editor
            aria-describedby={ariaDescribedby}
            className="Text__text"
            id={id}
            initialValue={this.state.value}
            name={name}
            onChange={(content, delta, source, editor) => {
              this._handleChange(content, delta, source, editor)
            }}
            setRef={setRef}
          />
        )
      })
    ) : (
      <input
        aria-describedby={ariaDescribedby}
        className="Text__text"
        id={id}
        name={name}
        defaultValue={this.state.value}
        onChange={this._handleChange}
        type="text"
        ref={setRef}
      />
    )
    this.setState({
      TextElement: textComponent,
    })
  }
  render() {
    const { message } = this.props.error
    const { className, id, labelText, wysiwyg } = this.props
    const { TextElement } = this.state

    const labelClickHandler = wysiwyg
      ? () => {
          if (this.state.wysiwygRef) {
            this.state.wysiwygRef.focus()
          }
        }
      : () => {}
    return (
      <div className={`${className} Text ${message ? 'Form__error Text--error' : ''}`}>
        <label onClick={labelClickHandler} className="Text__label" htmlFor={id}>
          {labelText}
        </label>
        {TextElement}
        {message && (
          <label onClick={labelClickHandler} className="Form__errorMessage" htmlFor={id}>
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
