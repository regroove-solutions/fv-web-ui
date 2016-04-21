import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';

import ConfGlobal from 'conf/local.json';

import AutoSuggestComponent from 'views/components/Editor/AutoSuggestComponent';
import AddMediaComponent from 'views/components/Editor/AddMediaComponent';
import SelectMediaComponent from 'views/components/Editor/SelectMediaComponent';

/**
* Define auto-suggest factory
*/
function renderInput(locals) {

  const onRequestEdit = function (event) {
    locals.onChange(null);
  }

  const onChange = function (event, full) {
    locals.onChange(full.uid)
  };

  const onComplete = function (uid) {
    locals.onChange(uid);
  };

  const onCancel = function () {
    locals.onChange(locals.context.initialValues[locals.attrs.name]);
  };

  let content;

  switch (locals.type) {
    case 'FVPicture':
      content = <div>
        <img src={ConfGlobal.baseURL + 'nxfile/default/' + locals.value} />
        <a onTouchTap={onRequestEdit}>Replace</a>
      </div>;
    break;

    case 'FVAudio':
      content = <div>
        <audio src={ConfGlobal.baseURL + 'nxfile/default/' + locals.value} controls />
        <a onTouchTap={onRequestEdit}>Replace</a>
      </div>;
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
  getTemplate() {
    return mediaTemplate
  }
}