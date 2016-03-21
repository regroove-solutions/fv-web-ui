/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, {Component, PropTypes} from 'react';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';
import classNames from 'classnames';

import {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } from 'material-ui';

// TODO: Cleanup class
@provide
export default class AddMediaComponent extends React.Component {

  static propTypes = {
    createAudio: PropTypes.func.isRequired,
    computeCreateAudio: PropTypes.object.isRequired,
    dialect: PropTypes.object.isRequired,
    onUploadComplete: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
  };

  getDefaultValues() {
    label: "Upload Media"
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  constructor(props) {
    super(props);

    this._change = this._change.bind(this);
    this._save = this._save.bind(this);

    var schema = t.struct({
      'title': t.String,
      'description': t.String,
      'file': t.form.File
    });

    this.state = {
      uploading: false,
      open: false,
      schema: schema,
      options: {
        fields: {
          'file': {
            label: 'File',
            type: 'file'
          }
        },
        config: {
          horizontal: {
            md: [3, 9],
            sm: [6, 6]
          }
        }
      }
    };
  }

  _change(value) {
    this.setState({value});
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.computeCreateAudio.success && !this.props.computeCreateAudio.success) {
      this.props.onUploadComplete(nextProps.computeCreateAudio.response.uid);
    }
  }

  _save(e) {

    e.preventDefault();


    //this.setState({'uploading': true});

    var value = this.refs['form_media'].getValue();

    var self = this;

    // If validation passed
    if (value) {

      let file;
      let fd = new FormData();

      for (let k in value) {
        let v = value[k];
        if (t.form.File.is(v)) {
          fd.append(k, v, v.name);
          file = v;
        } else {
          fd.append(k, v);
        }
      }

      if (file) {
        this.props.createAudio(this.props.dialect.path + '/Resources', {
          type: 'FVAudio',
          name: value.title,
          properties: 'dc:title=' + value.title + ' \ndc:description=' + value.description
        }, file);
      }


   }
  }



  render() {

    var form = "";

    if (this.state.schema != undefined){
     form = <form onSubmit={this._save} id="myForm" encType="multipart/form-data">
            <t.form.Form
              ref="form_media"
              options={this.state.options}
              type={this.state.schema} 
              value={this.state.value}
              onChange={this._change} />
              <button type="submit" className={classNames('btn', 'btn-primary')}>Upload Media</button>
          </form>;
    }

    var uploadText = "";

    if (this.state.uploading) {
      uploadText = <div className={classNames('alert', 'alert-info')} role="alert">Uploading... Please be patient...</div>
    }

    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleClose} />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={true}
        onTouchTap={this.handleClose} />,
    ];

      return (
        <div>
          <RaisedButton label={this.props.label} onTouchTap={this.handleOpen} />
          <Dialog
            title="Dialog With Actions"
            actions={actions}
            modal={true}
            open={this.state.open}>
            Upload to {this.props.dialect.get('dc:title')}
            <div className="form-horizontal">
              {uploadText}
              {form}
            </div>
          </Dialog>
        </div>
      );
    }
}
