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

import ProviderHelpers from 'common/ProviderHelpers';

import {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } from 'material-ui';

// TODO: Cleanup class
@provide
export default class AddMediaComponent extends Component {

  static propTypes = {
    createAudio: PropTypes.func.isRequired,
    computeAudio: PropTypes.object.isRequired,
    createPicture: PropTypes.func.isRequired,
    computePicture: PropTypes.object.isRequired,
    createVideo: PropTypes.func.isRequired,
    computeVideo: PropTypes.object.isRequired,
    dialect: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
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

  _handleSelectElement(value) {
    this.props.onComplete(value);
  }

  constructor(props) {
    super(props);

    this._change = this._change.bind(this);
    this._save = this._save.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this._handleSelectElement = this._handleSelectElement.bind(this);

    var schema = t.struct({
      'title': t.String,
      'description': t.String,
      'file': t.form.File
    });

    this.state = {
      typeError: '',
      uploading: false,
      open: false,
      schema: schema,
      pathOrId: null,
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

  /*componentWillReceiveProps(nextProps) {
    if (nextProps.computeCreateAudio.success && !this.props.computeCreateAudio.success) {
      //this.props.onComplete({"entity-type":"document","repository":"default","uid":"f3396e8e-9172-493c-9024-ab0042721ba3","path":"/FV/Workspaces/Data/TestFamily/TestLanguage/TestDialect/Resources/Ghetto Gospel.1462339518787","type":"FVAudio","state":"New","parentRef":"c663470b-9fe0-4d44-aaed-4bb3b070fad1","isCheckedOut":true,"changeToken":"1462339520039","title":"Ghetto Gospel","lastModified":"2016-05-04T05:25:20.03Z","properties":{"uid:uid":null,"uid:major_version":0,"uid:minor_version":0,"fvm:source":[],"fvm:child_focused":false,"fvm:origin":null,"fvm:recorder":[],"fvm:shared":false,"thumb:thumbnail":{"name":null,"mime-type":null,"encoding":null,"digestAlgorithm":"MD5","digest":"6e65473898a2498d47be0d4e4032474b","length":"374995","data":"http://localhost:8081/nuxeo/nxfile/default/f3396e8e-9172-493c-9024-ab0042721ba3/thumbnail:thumb:thumbnail"},"file:filename":null,"file:content":{"name":"04 2Pac Feat. Elton John - Ghetto Gospel.mp3","mime-type":"audio/mp3","encoding":null,"digestAlgorithm":"MD5","digest":"1dff258931e06f28c0b889e29795906d","length":"6092853","data":"http://localhost:8081/nuxeo/nxfile/default/f3396e8e-9172-493c-9024-ab0042721ba3/file:content/04%202Pac%20Feat.%20Elton%20John%20-%20Ghetto%20Gospel.mp3"},"common:size":6092853,"common:icon-expanded":null,"common:icon":"/icons/application.png","fva:language":"eb7fe8e5-9553-4cf7-a5db-a91cd9e56282","fva:dialect":"d8ea2ce2-552d-4484-a543-ea17f73e6cc2","fva:family":"816f6612-dc55-4141-bef6-053ff288bc65","dc:description":"Testing","dc:language":null,"dc:coverage":null,"dc:valid":null,"dc:creator":"Administrator","dc:modified":"2016-05-04T05:25:20.03Z","dc:lastContributor":"Administrator","dc:rights":null,"dc:expired":null,"dc:format":null,"dc:created":"2016-05-04T05:25:18.78Z","dc:title":"Ghetto Gospel","dc:issued":null,"dc:nature":null,"dc:subjects":[],"dc:contributors":["Administrator"],"dc:source":null,"dc:publisher":null,"fvl:import_id":null,"fvl:assigned_usr_id":null,"fvl:change_date":null,"fvl:status_id":null,"aud:duration":null},"facets":["Versionable","Publishable","Commentable","Thumbnail","Audio"]});
      this.setState({open: false});
    }
    else if (nextProps.computeCreatePicture.success && !this.props.computeCreatePicture.success) {
      this.props.onComplete(nextProps.computeCreatePicture.response);
      this.setState({open: false});
    }
  }*/

  _save(e) {

    e.preventDefault();

    this.setState({'uploading': true});

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

        let timestamp = Date.now();
        let ResourcesPath = this.props.dialect.path + '/Resources';

        let docParams = {
              type: this.props.type,
              name: value.title,
              properties: 'dc:title=' + value.title + ' \ndc:description=' + value.description
        };

        switch (this.props.type) {

          case 'FVAudio': 
            if (file.type.indexOf('audio') === 0) {
              this.props.createAudio(ResourcesPath, docParams, file, timestamp);
              this.setState({typeError: ''});
            } else {
              this.setState({typeError: <div className={classNames('alert', 'alert-warning')} role="alert">You tried to upload a file of type {file.type} when an audio file was expected.</div>});
            }
          break;

          case 'FVPicture':
            if (file.type.indexOf('image') === 0) {
              this.props.createPicture(ResourcesPath, docParams, file, timestamp);
              this.setState({typeError: ''});
            } else {
              this.setState({typeError: <div className={classNames('alert', 'alert-warning')} role="alert">You tried to upload a file of type {file.type} when an image file was expected.</div>});
            }
          break;

          case 'FVVideo':
            if (file.type.indexOf('video') === 0) {
              this.props.createVideo(ResourcesPath, docParams, file, timestamp);
              this.setState({typeError: ''});
            } else {
              this.setState({typeError: <div className={classNames('alert', 'alert-warning')} role="alert">You tried to upload a file of type {file.type} when an video file was expected.</div>});
            }
          break;

        }

        this.setState({
          pathOrId: this.props.dialect.path + '/Resources/' + value.title + '.' + timestamp
        })
      }
   }
  }

  render() {

      let computeCreate;
      let uploadText = "";
      let form = "";
      let fileTypeLabel = "File";

      const actions = [
        <FlatButton
          label="Cancel"
          secondary={true}
          onTouchTap={this.handleClose} />
      ];

      switch (this.props.type) {
        case 'FVAudio':
          computeCreate = ProviderHelpers.getEntry(this.props.computeAudio, this.state.pathOrId);
          fileTypeLabel = 'Audio';
        break;

        case 'FVPicture':
          computeCreate = ProviderHelpers.getEntry(this.props.computePicture, this.state.pathOrId);
          fileTypeLabel = 'Picture';
        break;

        case 'FVVideo':
          computeCreate = ProviderHelpers.getEntry(this.props.computeVideo, this.state.pathOrId);
          fileTypeLabel = 'Video';
        break;
      }

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

      if (computeCreate && computeCreate.isFetching) {
        uploadText = <div className={classNames('alert', 'alert-info')} role="alert">Uploading... Please be patient...</div>
      }

      if (computeCreate && computeCreate.success) {
        uploadText =  <div className={classNames('alert', 'alert-success')} role="success">Upload successful!</div>
        actions.push(<FlatButton
          label="Insert into Entry"
          primary={true}
          onTouchTap={this._handleSelectElement.bind(this, computeCreate.response)} />);
        form = "";
      }

      return (
        <div>
          <RaisedButton label={this.props.label} onTouchTap={this.handleOpen} />
          <Dialog
            title={"Create New " + fileTypeLabel + " in the " + this.props.dialect.get('dc:title') + " dialect."}
            actions={actions}
            modal={true}
            open={this.state.open}>
            <div className="form-horizontal">
              {this.state.typeError}
              {uploadText}
              {form}
            </div>
          </Dialog>
        </div>
      );
    }
}
