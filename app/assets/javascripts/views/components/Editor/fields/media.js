import React from 'react';
import t from 'tcomb-form';
import selectn from 'selectn';

import AddMediaComponent from 'views/components/Editor/AddMediaComponent';
import SelectMediaComponent from 'views/components/Editor/SelectMediaComponent';

import Paper from 'material-ui/lib/paper';

/**
* Define auto-suggest factory
*/
function renderInput(locals) {

  const onRequestEdit = function (event) {
    locals.onChange(null);
  }

  const onComplete = function (fullValue) {
    locals.onChange(fullValue.uid);
    locals.setExpandedValue(fullValue);
  };

  const onCancel = function () {

    let initialValue = selectn('context.initialValues.' + locals.attrs.name, locals);

    if (initialValue)
      locals.onChange(initialValue);
  };

  let content;

  switch (locals.type) {
    case 'FVPicture':
      content = <Paper zDepth={1}>
        <strong>{selectn('attrs.expandedValue.title', locals)}</strong> 
        <span> {selectn('attrs.expandedValue.properties.dc:description', locals)}</span><br/>
        <img src={selectn('attrs.expandedValue.properties.file:content.data', locals)} alt={selectn('attrs.expandedValue.title', locals)} />
        <a onTouchTap={onRequestEdit}>Replace</a>
      </Paper>;
    break;

    case 'FVAudio':
      content = <Paper zDepth={1}>
        <strong>{selectn('attrs.expandedValue.title', locals)}</strong> 
        <span> {selectn('attrs.expandedValue.properties.dc:description', locals)}</span><br/>
        <audio src={selectn('attrs.expandedValue.properties.file:content.data', locals)} controls />
        <a onTouchTap={onRequestEdit}>Replace</a>
      </Paper>;
    break;

    case 'FVVideo':
      content = <Paper zDepth={1}>
        <strong>{selectn('attrs.expandedValue.title', locals)}</strong> 
        <span> {selectn('attrs.expandedValue.properties.dc:description', locals)}</span><br/>
        <video width="320" height="240" src={selectn('attrs.expandedValue.properties.file:content.data', locals)} controls />
        <a onTouchTap={onRequestEdit}>Replace</a>
      </Paper>;
    break;
  }

  if (!locals.value) {
    content = <div>
                <AddMediaComponent type={locals.type} label="Upload" onComplete={onComplete} dialect={locals.context} />
                <SelectMediaComponent type={locals.type} label="Browse" onComplete={onComplete} dialect={locals.context} />
                <a onTouchTap={onCancel}>Cancel</a>
              </div>;
  }

  return <div>{content}</div>;
}

const mediaTemplate = t.form.Form.templates.textbox.clone({ renderInput })

export default class MediaFactory extends t.form.Textbox {

  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { expandedValue: null } );
  }

  setExpandedValue = (expandedValue) => {
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
    return mediaTemplate
  }
}