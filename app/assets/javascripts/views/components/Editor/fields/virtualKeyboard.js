import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';

function renderInput(locals) {

  const onChange = function (event) {
    locals.onChange(event.target.value);
  };

  const triggerRealInputChange = function (event) {
  	locals.onChange(document.getElementById('virtual-keyboard-helper-' + locals.attrs.name).value);
  };

  return <div>
  	<input type="text" label={locals.label} name={locals.attrs.name} value={locals.value} onChange={onChange} style={{display: 'none'}} />
  	<input type="text" id={'virtual-keyboard-helper-' + locals.attrs.name} className="form-control" label={locals.label} onBlur={triggerRealInputChange} />
  </div>;
}

const textboxTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class VirtualKeyboardFactory extends t.form.Textbox {

  getTemplate() {
    return textboxTemplate
  }
}
