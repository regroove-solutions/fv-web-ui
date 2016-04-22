import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';

import DirectoryList from 'views/components/Editor/DirectoryList';

function renderInput(locals) {

  const onChange = function (value) {
    locals.onChange(value)
  };

  return <div>
  	<DirectoryList label={locals.label} onChange={onChange} directory={locals.attrs.directory} />
  </div>;
}

const selectTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class SelectFactory extends t.form.Textbox {

  getTemplate() {
    return selectTemplate
  }
}