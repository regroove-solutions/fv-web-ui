import React from 'react'
import t from 'tcomb-form'

function renderInput(locals) {
  const onChange = (event) => {
    if (event.target.checked) {
      locals.onChange(locals.context[locals.attrs.name])
    } else {
      locals.onChange(null)
    }
  }

  return (
    <label style={{ fontWeight: 'normal' }}>
      <input
        type="checkbox"
        ref="valued_checkbox"
        id={'virtual-keyboard-helper-' + locals.attrs.name}
        value={locals.context[locals.attrs.name]}
        name={locals.attrs.name}
        onChange={onChange}
      />
      <span>&nbsp;</span>
      <span>{locals.label}</span>
    </label>
  )
}

const textboxTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class ValuedCheckboxFactory extends t.form.Textbox {
  /**
   * Manually reset element
   */
  forceReset() {
    this.refs.valued_checkbox.checked = false
  }

  getTemplate() {
    return textboxTemplate
  }
}
