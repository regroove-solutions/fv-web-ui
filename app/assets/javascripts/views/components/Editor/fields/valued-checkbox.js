import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';

function renderLabel(locals) {
    return '';
}

function renderInput(locals) {

  let initialValue = null;

  if (!initialValue) {
    initialValue = locals.value;
  }

  const onChange = function (e) {
    if (e.target.checked) {
      locals.onChange(initialValue)
    } else {
      locals.onChange(null);
    }
  };

  return <label style={{fontWeight: 'normal'}}><input type="checkbox" ref="valued_checkbox" value={locals.value} onChange={onChange} /><span>&nbsp;</span> <span>{locals.label}</span></label>;
}

const checkboxTemplate = t.form.Form.templates.textbox.clone({ renderInput, renderLabel })

export default class ValuedCheckboxFactory extends t.form.Textbox {

  /**
   * Manually reset element
   */
  reset() {
    this.refs.valued_checkbox.checked = false;
  }

  getTemplate() {
    return checkboxTemplate
  }
}