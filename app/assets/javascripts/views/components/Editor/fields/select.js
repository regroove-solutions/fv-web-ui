import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';

import AutoSuggestComponent from 'views/components/Editor/AutoSuggestComponent';
import AddMediaComponent from 'views/components/Editor/AddMediaComponent';

/**
* Define auto-suggest factory
*/
function renderInput(locals) {

  const onChange = function (event, full) {
    locals.onChange(full.uid)
  };

  const onUploadComplete = function (uid) {
    locals.onChange(uid);
  };

  let content = <div>TODO: {locals.type} Preview Component<br/>{locals.value}</div>;;

  if (!locals.value) {
    content = <div>
                <AutoSuggestComponent type={locals.type} value={locals.value || ''} dialect={locals.context} onChange={onChange} />
                <AddMediaComponent label="Upload" onUploadComplete={onUploadComplete} dialect={locals.context} />
              </div>;
  }

  return <div>{content}</div>;
}

const selectTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class SelectFactory extends t.form.Textbox {

  getTemplate() {
    return selectTemplate
  }
}