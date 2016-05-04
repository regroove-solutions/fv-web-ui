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

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import IconButton from 'material-ui/lib/icon-button';

import TextField from 'material-ui/lib/text-field';

import {
      Card, CardHeader, CardMedia, CardTitle, CardActions, CardText, Avatar, FlatButton,
      Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, DropDownIcon, FontIcon, RaisedButton,
      Tabs, Tab,
      Dialog
    } from 'material-ui';

const gridListStyle = {width: 840, height: 500, overflowY: 'auto', marginBottom: 10};

@provide
export default class SelectMediaComponent extends React.Component {

  static propTypes = {
    onComplete: PropTypes.func.isRequired,
    fetchSharedPictures: PropTypes.func.isRequired,
    computeSharedPictures: PropTypes.object.isRequired,
    fetchSharedAudios: PropTypes.func.isRequired,
    computeSharedAudios: PropTypes.object.isRequired,
    fetchSharedVideos: PropTypes.func.isRequired,
    computeSharedVideos: PropTypes.object.isRequired,
    dialect: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  getDefaultValues() {
    label: "Upload Media"
  }

  _handleOpen() {
    this.setState({open: true});
  }

  _handleClose() {
    this.setState({open: false});
  }

  _handleSearchChange(event) {

    var timeout;

    if (timeout) {
        clearTimeout(timeout);
    }

    var target = event.target;  

    timeout = setTimeout(function() {
        this.fetchData(target.value);
    }.bind(this), 750);
  }

  _handleSelectElement(value) {
    this.props.onComplete(value);
  }

  constructor(props) {
    super(props);

    // Bind methods to 'this'
    ['_handleOpen', '_handleClose', '_handleSearchChange', '_handleSelectElement', '_getMediaPreview'].forEach( (method => this[method] = this[method].bind(this)) );

    this.state = {
      open: false
    };
  }

  fetchData(value = '') {
    if (this.props.dialect) {

      switch(this.props.type) {
        case 'FVPicture':
          this.props.fetchSharedPictures('all_shared_pictures', 'currentPageIndex=1&pageSize=1000&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
        break;

        case 'FVAudio':
          this.props.fetchSharedAudios('all_shared_audio', 'currentPageIndex=1&pageSize=1000&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
        break;

        case 'FVVideo':
          this.props.fetchSharedVideos('all_shared_videos', 'currentPageIndex=1&pageSize=1000&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
        break;
      }
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  _getMediaPreview(tile) {
    switch (this.props.type) {
      case 'FVAudio':
        return <audio style={{height: '98px'}} src={tile.properties['file:content'].data} controls />
      break;

      case 'FVPicture':
        return <img src={tile.properties['picture:views'][1].content.data} />;
      break;

      case 'FVVideo':
        return <video height={190} src={tile.properties['file:content'].data} controls />
      break;
    }

    return '';
  }

  render() {

      var results;

      switch (this.props.type) {
        case 'FVAudio':
          results = this.props.computeSharedAudios.response.entries || [];
        break;

        case 'FVPicture':
          results = this.props.computeSharedPictures.response.entries || [];
        break;

        case 'FVVideo':
          results = this.props.computeSharedVideos.response.entries || [];
        break;
      }

      const actions = [
        <FlatButton
          label="Cancel"
          secondary={true}
          onTouchTap={this._handleClose} />
      ];

      let fileTypeLabel = 'File';
      let fileTypeCellHeight = 210;
      let fileTypeTilePosition = 'bottom';

      switch (this.props.type) {
        case 'FVAudio':
          fileTypeLabel = 'audio files';
          fileTypeCellHeight = 100;
          fileTypeTilePosition = 'top';
        break;

        case 'FVPicture':
          fileTypeLabel = 'pictures';
        break;

        case 'FVVideo':
          fileTypeLabel = 'videos';
          fileTypeTilePosition = 'top';
        break;
      }

      return (
        <div>
          <RaisedButton label={this.props.label} onTouchTap={this._handleOpen} />
          <Dialog
            title={"Select existing " + fileTypeLabel + " from the " + this.props.dialect.get('dc:title') + " dialect:"}
            actions={actions}
            modal={true}
            open={this.state.open}>

            <div className="form-horizontal">
              <div>
                <TextField
                  fullWidth={true} 
                  onChange={this._handleSearchChange}
                  hintText="Begin typing search value to filter list..."
                  floatingLabelText="Quick Search" />
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                <GridList
                  cols={3}
                  cellHeight={fileTypeCellHeight}
                  style={gridListStyle}
                  >
                  {
                    results.filter(tile => selectn('properties.file:content.data', tile)).map(tile => <GridTile
                    key={tile.uid}
                    onTouchTap={this._handleSelectElement.bind(this, tile)}
                    title={tile.title}
                    titlePosition={fileTypeTilePosition}
                    subtitle={<span><strong>{tile.properties['dc:description']}</strong></span>}
                    >
                      {this._getMediaPreview(tile)}
                    </GridTile>)
                  }
                </GridList>
              </div>
            </div>
          </Dialog>
        </div>
      );
    }
}
