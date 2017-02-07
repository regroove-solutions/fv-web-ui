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

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';

import MetadataList from 'views/components/Browsing/metadata-list';

import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import Divider from 'material-ui/lib/divider';

import CircularProgress from 'material-ui/lib/circular-progress';

const MEDIA_COPYRIGHT_NOTICE = <small>&copy; This database is protected by copyright laws and is owned by the First Peoples’ Cultural Foundation. All materials on this site are protected by copyright laws and are owned by the individual Indigenous language communities who created the archival content. Language and multimedia data available on this site is intended for private, non-commercial use by individuals. Any commercial use of the language data or multimedia data in whole or in part, directly or indirectly, is specifically forbidden except with the prior written authority of the owner of the copyright.</small>;

const GetMetaData = function (type, response) {

  let metadata = [];

  /**
   * Recorders
   */
  let recorders = [];
  
  {(selectn('contextParameters.media.recorders', response) || []).map(function(recorder, key) {
    recorders.push(<Preview expandedValue={recorder} key={key} type="FVContributor" />);
  })};

  metadata.push({
    label: 'Recorder(s)',
    value: recorders
  });

  /**
   * Contributors
   */
  let contributors = [];
  
  {(selectn('contextParameters.media.sources', response) || []).map(function(contributor, key) {
    contributors.push(<Preview expandedValue={contributor} key={key} type="FVContributor" />);
  })};

  metadata.push({
    label: 'Contributor(s)',
    value: contributors
  });

  /**
   * Origin
   */
  if (selectn("contextParameters.media.origin", response)) {
    metadata.push({
      label: 'Original Associated Word/Phrase',
      value: selectn("contextParameters.media.origin.dc:title", response) + ' (Path: ' + selectn("contextParameters.media.origin.path", response) + ')'
    });
  }

  /**
   * Child Focused
   */
  metadata.push({
    label: 'Child Focused',
    value: (selectn("properties.fvm:child_focused", response)) ? 'Yes' : 'No'
  });

  /**
   * Shared
   */
  metadata.push({
    label: 'Shared',
    value: (selectn("properties.fvm:shared", response)) ? 'Yes' : 'No'
  });

  /**
   * Direct Link
   */
  metadata.push({
    label: 'Direct Link',
    value: <input type="textbox" style={{width: '100%'}} value={selectn("properties.file:content.data", response)} />
  });

  /**
   * File size
   */
  metadata.push({
    label: 'Size',
    value: StringHelpers.getReadableFileSize(selectn("properties.file:content.length", response))
  });

  /**
   * Date created
   */
  metadata.push({
    label: 'Date Created',
    value: selectn("properties.dc:created", response)
  });

  return metadata;
};


@provide
export default class Preview extends Component {

  static propTypes = {
    fetchWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired,
    fetchPhrase: PropTypes.func.isRequired,
    computePhrase: PropTypes.object.isRequired,
    fetchCategory: PropTypes.func.isRequired,
    computeCategory: PropTypes.object.isRequired,
    fetchPicture: PropTypes.func.isRequired,
    computePicture: PropTypes.object.isRequired,
    fetchAudio: PropTypes.func.isRequired,
    computeAudio: PropTypes.object.isRequired,
    fetchVideo: PropTypes.func.isRequired,
    computeVideo: PropTypes.object.isRequired,
    fetchContributor: PropTypes.func.isRequired,
    computeContributor: PropTypes.object.isRequired,
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    expandedValue: PropTypes.object,
    styles: PropTypes.object
  };

  static defaultProps = {
    styles: {}
  };

  constructor(props) {
    super(props);

    // Bind methods to 'this'
    ['_handleExpandChange'].forEach( (method => this[method] = this[method].bind(this)) );
    
  }

  componentDidMount() {

    // Only fetch from server if expanded value isn't provided
    if (!this.props.expandedValue && this.props.id) {
      switch (this.props.type) {
        case 'FVWord':
          this.props.fetchWord(this.props.id);
        break;

        case 'FVPhrase':
          this.props.fetchPhrase(this.props.id);
        break;

        case 'FVCategory':
          this.props.fetchCategory(this.props.id);
        break;

        case 'FVPicture':
            this.props.fetchPicture(this.props.id);
        break;

        case 'FVAudio':
            this.props.fetchAudio(this.props.id);
        break;

        case 'FVVideo':
            this.props.fetchVideo(this.props.id);
        break;

        case 'FVContributor':
            this.props.fetchContributor(this.props.id);
        break;
      }
    }
  }

  /**
   * Request additional media info when expanded.
   */
  _handleExpandChange(id, fetchFunc, event, expanded) {
    fetchFunc(id);
  }

  render() {

      let handleExpandChange = () => {};

      let previewStyles = Object.assign({
        padding: '10px'
      }, this.props.styles);

      let body = <CircularProgress mode="indeterminate" size={1} />;

      switch (this.props.type) {
        case 'FVWord':
          let word = {};
          let wordResponse;

          if (this.props.expandedValue) {
            word.success = true;
            wordResponse = this.props.expandedValue;
          }
          else {
            word = ProviderHelpers.getEntry(this.props.computeWord, this.props.id);
            wordResponse = selectn('response', word);
          }

          if (wordResponse && word.success) {
            body = <div><strong>{wordResponse.title}</strong></div>;
          }
        break;

        case 'FVPhrase':
          let phrase = {};
          let phraseResponse;

          if (this.props.expandedValue) {
            phrase.success = true;
            phraseResponse = this.props.expandedValue;
          }
          else {
            phrase = ProviderHelpers.getEntry(this.props.computePhrase, this.props.id);
            phraseResponse = selectn('response', phrase);
          }

          if (phraseResponse && phrase.success) {
            body = <div><strong>{phraseResponse.title}</strong></div>;
          }
        break;

        case 'FVCategory':

          let category = {};
          let categoryResponse;

          if (this.props.expandedValue) {
            category.success = true;
            categoryResponse = this.props.expandedValue;
          }
          else {
            category = ProviderHelpers.getEntry(this.props.computeCategory, this.props.id);
            categoryResponse = selectn('response', category);
          }

          if (categoryResponse && category.success) {

            let breadcrumb = [];

            (selectn('contextParameters.breadcrumb.entries', categoryResponse) || []).map(function(entry, i) {
              if (entry.type === 'FVCategory') {

                let shared = '';

                if (entry.path.indexOf('SharedData') !== -1)
                  shared = ' (Shared)';

                breadcrumb.push(<span key={i}> &raquo; {entry.title} {shared}</span>);
              }
            });

            body = <div><strong>{breadcrumb}</strong></div>;
          }
        break;

        case 'FVPicture':

          let picture = {};
          let pictureResponse;

          let remotePicture = ProviderHelpers.getEntry(this.props.computePicture, this.props.id || this.props.expandedValue.uid);

          if (this.props.expandedValue && !selectn('success', remotePicture)) {
            picture.success = true;
            pictureResponse = this.props.expandedValue;
            handleExpandChange = this._handleExpandChange.bind(this, this.props.expandedValue.uid, this.props.fetchPicture);
          }
          else {
            picture = remotePicture;
            pictureResponse = selectn('response', picture);
          }

          if (pictureResponse && picture.success) {

            body =   <Card onExpandChange={handleExpandChange}>
                      <CardMedia>
                        {(selectn('properties.file:content.data', pictureResponse) || selectn('path', pictureResponse) && selectn('path', pictureResponse).indexOf('nxfile') != -1) ? <img style={{maxWidth: '100%'}} src={selectn('properties.file:content.data', pictureResponse) || (ConfGlobal.baseURL + selectn('path', pictureResponse))} alt={selectn('title', pictureResponse)} /> : null}
                      </CardMedia>
                      <CardHeader
                        title={selectn('title', pictureResponse) || selectn('dc:title', pictureResponse)}
                        titleStyle={{lineHeight: 'initial'}}
                        subtitle={selectn('properties.dc:description', pictureResponse) || selectn('dc:description', pictureResponse)}
                        subtitleStyle={{lineHeight: 'initial'}}
                        actAsExpander={true}
                        showExpandableButton={true}
                      />
                      <CardText expandable={true}>
                        <MetadataList style={{lineHeight: 'initial'}} metadata={GetMetaData('picture', pictureResponse)} />
                        <p style={{lineHeight: 'initial', whiteSpace: 'initial'}}>{MEDIA_COPYRIGHT_NOTICE}</p>
                      </CardText>
                    </Card>;
          }

        break;

        case 'FVAudio':

          let audio = {};
          let audioResponse;
          let audioTag = '';

          let remoteAudio = ProviderHelpers.getEntry(this.props.computeAudio, this.props.id || this.props.expandedValue.uid);

          if (this.props.expandedValue && !selectn('success', remoteAudio)) {
            audio.success = true;
            audioResponse = this.props.expandedValue;
            handleExpandChange = this._handleExpandChange.bind(this, this.props.expandedValue.uid, this.props.fetchAudio);
          }
          else {
            audio = remoteAudio;
            audioResponse = selectn('response', audio);
          }

          if (audioResponse && audio.success) {

            audioTag = <audio src={selectn('properties.file:content.data', audioResponse) || (ConfGlobal.baseURL + selectn('path', audioResponse))} alt={selectn('title', audioResponse)} controls />;

            body =   <Card onExpandChange={handleExpandChange}>
                     <CardHeader
                        title={selectn('title', audioResponse) || selectn('dc:title', audioResponse)}
                        titleStyle={{lineHeight: 'initial'}}
                        subtitle={selectn('properties.dc:description', audioResponse) || selectn('dc:description', audioResponse)}
                        subtitleStyle={{lineHeight: 'initial'}}
                        actAsExpander={true}
                        showExpandableButton={true}
                      />
                      <CardMedia>
                        {(selectn('properties.file:content.data', audioResponse) || selectn('path', audioResponse) && selectn('path', audioResponse).indexOf('nxfile') != -1) ? audioTag : null}
                      </CardMedia>
                      <CardText expandable={true}>
                        <MetadataList style={{lineHeight: 'initial'}} metadata={GetMetaData('audio', audioResponse)} />
                        <p style={{lineHeight: 'initial', whiteSpace: 'initial'}}>{MEDIA_COPYRIGHT_NOTICE}</p>
                      </CardText>
                    </Card>;
          }

        break;

        case 'FVVideo':

          let video = {};
          let videoResponse;

          let remoteVideo = ProviderHelpers.getEntry(this.props.computeVideo, this.props.id || this.props.expandedValue.uid);

          if (this.props.expandedValue && !selectn('success', remoteVideo)) {
            video.success = true;
            videoResponse = this.props.expandedValue;
            handleExpandChange = this._handleExpandChange.bind(this, this.props.expandedValue.uid, this.props.fetchVideo);
          }
          else {
            video = remoteVideo;
            videoResponse = selectn('response', video);
          }

          if (videoResponse && video.success) {

            body =   <Card onExpandChange={handleExpandChange}>
                      <CardMedia>
                        {(selectn('properties.file:content.data', videoResponse) || selectn('path', videoResponse) && selectn('path', videoResponse).indexOf('nxfile') != -1) ? <video width="100%" height="auto" src={selectn('properties.file:content.data', videoResponse) || (ConfGlobal.baseURL + selectn('path', videoResponse))} alt={selectn('title', videoResponse)} controls /> : null}
                      </CardMedia>
                      <CardHeader
                        title={selectn('title', videoResponse) || selectn('dc:title', videoResponse)}
                        titleStyle={{lineHeight: 'initial'}}
                        subtitle={selectn('properties.dc:description', videoResponse) || selectn('dc:description', videoResponse)}
                        subtitleStyle={{lineHeight: 'initial'}}
                        actAsExpander={true}
                        showExpandableButton={true}
                      />
                      <CardText expandable={true}>
                        <MetadataList style={{lineHeight: 'initial'}} metadata={GetMetaData('video', videoResponse)} />
                        <p style={{lineHeight: 'initial', whiteSpace: 'initial'}}>{MEDIA_COPYRIGHT_NOTICE}</p>
                      </CardText>
                    </Card>;
          }

        break;

        case 'FVContributor':

          let contributor = {};
          let contributorResponse;

          if (this.props.expandedValue) {
            contributor.success = true;
            contributorResponse = this.props.expandedValue;
          }
          else {
            contributor = ProviderHelpers.getEntry(this.props.computeContributor, this.props.id);
            contributorResponse = selectn('response', contributor);
          }

          if (contributorResponse && contributor.success) {
            body = <div>
              <strong>{selectn('title', contributorResponse) || selectn('dc:title', contributorResponse)}</strong> 
              <span> {selectn('properties.dc:description', contributorResponse) || selectn('dc:description', contributorResponse)}</span>
            </div>;
          }

        break;
      }

      return (
        <div style={previewStyles}>
          {body}
        </div>
      );
    }
}
