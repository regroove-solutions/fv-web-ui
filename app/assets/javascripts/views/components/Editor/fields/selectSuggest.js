import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';
import selectn from 'selectn';

import AutoSuggestComponent from 'views/components/Editor/AutoSuggestComponent';
import Preview from 'views/components/Editor/Preview';
import DialogCreateForm from 'views/components/DialogCreateForm';

/**
* Define auto-suggest factory
*/
function renderInput(locals) {

  const onChange = function (event, fullValue) {
    locals.onChange(fullValue.uid);
    locals.setExpandedValue(fullValue);
  };

  let content = <Preview id={locals.value} expandedValue={selectn('attrs.expandedValue', locals)} type={locals.type} />

  if (!locals.value) {
    content = <div>
                <AutoSuggestComponent locals={locals} type={locals.type} value={locals.value || ''} provider={locals.attrs.page_provider} dialect={locals.context} onChange={onChange} />
                <DialogCreateForm context={locals.context} onChange={onChange} fieldAttributes={locals.attrs} />
              </div>;
  }

  return <div>{content}</div>;
}

const selectSuggestTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class SelectSuggestFactory extends t.form.Textbox {

  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { expandedValue: null } );

    this.setExpandedValue = this.setExpandedValue.bind(this);
  }

  setExpandedValue(expandedValue) {
    this.setState({ expandedValue });
  }

  getLocals() {
    const locals = super.getLocals();
    locals.attrs = this.getAttrs();
    locals.setExpandedValue = this.setExpandedValue;
    locals.attrs.expandedValue = this.state.expandedValue;

    return locals;
  }

  getTemplate() {
    return selectSuggestTemplate
  }
}