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

import CircularProgress from 'material-ui/lib/circular-progress';

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

  render() {

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

          if (this.props.expandedValue) {
            picture.success = true;
            pictureResponse = this.props.expandedValue;
          }
          else {
            picture = ProviderHelpers.getEntry(this.props.computePicture, this.props.id);
            pictureResponse = selectn('response', picture);
          }

          if (pictureResponse && picture.success) {
            body = <div>
              <strong>{selectn('title', pictureResponse) || selectn('dc:title', pictureResponse)}</strong> 
              <span> {selectn('properties.dc:description', pictureResponse) || selectn('dc:description', pictureResponse)}</span><br/>
              {(selectn('properties.file:content.data', pictureResponse) || selectn('path', pictureResponse) && selectn('path', pictureResponse).indexOf('nxfile') != -1) ? <img style={{maxWidth: '100%'}} src={selectn('properties.file:content.data', pictureResponse) || (ConfGlobal.baseURL + selectn('path', pictureResponse))} alt={selectn('title', pictureResponse)} /> : ''}
            </div>;
          }

        break;

        case 'FVAudio':

          let audio = {};
          let audioResponse;

          if (this.props.expandedValue) {
            audio.success = true;
            audioResponse = this.props.expandedValue;
          }
          else {
            audio = ProviderHelpers.getEntry(this.props.computeAudio, this.props.id);
            audioResponse = selectn('response', audio);
          }

          if (audioResponse && audio.success) {
            body = <div>
              <strong>{selectn('title', audioResponse) || selectn('dc:title', audioResponse)}</strong> 
              <span> {selectn('properties.dc:description', audioResponse) || selectn('dc:description', audioResponse)}</span><br/>
              {(selectn('properties.file:content.data', audioResponse) || selectn('path', audioResponse) && selectn('path', audioResponse).indexOf('nxfile') != -1) ? <audio src={selectn('properties.file:content.data', audioResponse) || (ConfGlobal.baseURL + selectn('path', audioResponse))} alt={selectn('title', audioResponse)} controls /> : ''}
            </div>;
          }

        break;

        case 'FVVideo':

          let video = {};
          let videoResponse;

          if (this.props.expandedValue) {
            video.success = true;
            videoResponse = this.props.expandedValue;
          }
          else {
            video = ProviderHelpers.getEntry(this.props.computeVideo, this.props.id);
            videoResponse = selectn('response', video);
          }

          if (videoResponse && video.success) {
            body = <div>
              <strong>{selectn('title', videoResponse) || selectn('dc:title', videoResponse)}</strong> 
              <span> {selectn('properties.dc:description', videoResponse) || selectn('dc:description', videoResponse)}</span><br/>
              {(selectn('properties.file:content.data', videoResponse) || selectn('path', videoResponse) && selectn('path', videoResponse).indexOf('nxfile') != -1) ? <video width="320" height="240" src={selectn('properties.file:content.data', videoResponse) || (ConfGlobal.baseURL + selectn('path', videoResponse))} alt={selectn('title', videoResponse)} controls /> : ''}
            </div>;
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
