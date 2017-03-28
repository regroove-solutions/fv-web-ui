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
import React, { Component, PropTypes } from 'react';
import Immutable, { List, Map } from 'immutable';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import Colors from 'material-ui/lib/styles/colors';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import IconButton from 'material-ui/lib/icon-button';

import AVPlayArrow from 'material-ui/lib/svg-icons/av/play-arrow';
import AVStop from 'material-ui/lib/svg-icons/av/stop';

import ProviderHelpers from 'common/ProviderHelpers';
import UIHelpers from 'common/UIHelpers';

export default class GridView extends Component {

  static propTypes = {
    items: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(List)
    ]),
    filteredItems: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(List)
    ]),
    action: PropTypes.func,
    cols: PropTypes.number,
    type: PropTypes.string,
    gridListTile: PropTypes.func,
  };

  static defaultProps = {
    cols: 4,
    cellHeight: 160
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      nowPlaying: null
    };

    ['_handleAudioPlayback'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  componentWillUnmount() {
    if (this.state.nowPlaying != null) {
      this.state.nowPlaying.pause();
      this.state.currentTime = 0;
    }
  }
  
  _handleAudioPlayback(e) {

  }

  render() {

    let items = this.props.filteredItems || this.props.items;
    let single = '';

    switch (this.props.type) {
      case 'FVWord':
        single = 'word';
      break;

      case 'FVPhrase':
        single = 'phrase';
      break;
    }

    return <div className="grid-view">
              <GridList
                cols={this.props.cols}
                cellHeight={this.props.cellHeight}
                style={{width: '100%', overflowY: 'auto', marginBottom: 24}}
                >
                  {(items).map(function (tile, i) { 

                    if (this.props.gridListTile) {
                      return React.createElement(this.props.gridListTile, { key: tile.uid, tile: tile });
                    }

                    let audioIcon, audioCallback = null;
                    let definitionsHTML, literal_translationsHTML;

                    let title = selectn('properties.dc:title', tile);
                    let definitions = selectn('properties.fv:definitions', tile);
                    let literal_translations = selectn('properties.fv:literal_translation', tile);

                    let audio = selectn('contextParameters.' + single + '.related_audio[0].path', tile);
                    let imageObj = selectn('contextParameters.' + single + '.related_pictures[0]', tile);

                    if (audio) {

                      const stateFunc = function(state) { this.setState(state); }.bind(this);

                      audioIcon = (decodeURIComponent(selectn('src', this.state.nowPlaying)) !== ConfGlobal.baseURL + audio) ? <AVPlayArrow style={{marginRight: '10px'}} color='white' /> : <AVStop style={{marginRight: '10px'}} color='white' />;
                      audioCallback = (decodeURIComponent(selectn('src', this.state.nowPlaying)) !== ConfGlobal.baseURL + audio) ? UIHelpers.playAudio.bind(this, this.state, stateFunc, ConfGlobal.baseURL + audio) : UIHelpers.stopAudio.bind(this, this.state, stateFunc);
                    }

                    if (definitions && definitions.length > 0) {
                      definitionsHTML = definitions.map(function(definition, key){
                        return <span key={key} style={{whiteSpace: 'initial'}}>{selectn('translation', definition)}</span>;
                      })
                    }
                    
                    if (literal_translations && literal_translations.length > 0) {
                      literal_translationsHTML = literal_translations.map(function(definition, key){
                        return <span key={key} style={{whiteSpace: 'initial'}}>{selectn('translation', definition)}</span>;
                      });
                    }

                    let audioIconAction = <IconButton onTouchTap={audioCallback}>{audioIcon}</IconButton>;

                    return <GridTile
                      onTouchTap={(this.props.action) ? this.props.action.bind(this, tile.uid, tile) : audioCallback}
                      key={tile.uid}
                      title={title}
                      actionPosition="right"
                      actionIcon={(this.props.action) ? audioIconAction : audioIcon}
                      subtitle={definitionsHTML || literal_translationsHTML}
                      ><img style={{filter: 'grayscale(100%) opacity(80%)'}} src={UIHelpers.getThumbnail(imageObj, 'Small')} alt={title} /></GridTile>
                  }.bind(this))}
              </GridList>
            </div>;
  }
}