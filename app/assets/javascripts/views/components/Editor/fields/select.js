import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';

import AutoSuggestComponent from 'views/components/Editor/AutoSuggestComponent';
//import AddMediaComponent from 'views/components/Editor/AddMediaComponent';
import Preview from 'views/components/Editor/Preview';

/**
* Define auto-suggest factory
*/
function renderInput(locals) {

  const onChange = function (event, full) {
    locals.onChange(full.uid)
  };

  /*const onComplete = function (uid) {
    locals.onChange(uid);
  };*/

  // <AddMediaComponent label="Upload" type={locals.type} onComplete={onComplete} dialect={locals.context} />

  let content = <Preview id={locals.value} type={locals.type} />;

  if (!locals.value) {
    content = <div>
                <AutoSuggestComponent type={locals.type} value={locals.value || ''} dialect={locals.context} onChange={onChange} />
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