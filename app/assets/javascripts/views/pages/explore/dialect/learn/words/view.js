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
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';

import Preview from 'views/components/Editor/Preview';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import MetadataPanel from 'views/pages/explore/dialect/learn/base/metadata-panel';
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel';
import PageToolbar from 'views/pages/explore/dialect/page-toolbar';
import SubViewTranslation from 'views/pages/explore/dialect/learn/base/subview-translation';

import {Link} from 'provide-page';

//import Header from 'views/pages/explore/dialect/header';
//import PageHeader from 'views/pages/explore/dialect/page-header';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import Divider from 'material-ui/lib/divider';

import ListUI from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import '!style-loader!css-loader!react-image-gallery/build/image-gallery.css';

import withActions from 'views/hoc/view/with-actions';

const DetailsViewWithActions = withActions(PromiseWrapper, true);

/**
* View word entry
*/
@provide
export default class View extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    fetchWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired,
    deleteWord: PropTypes.func.isRequired,
    computeDeleteWord: PropTypes.object.isRequired,
    publishWord: PropTypes.func.isRequired,
    askToPublishWord: PropTypes.func.isRequired,
    unpublishWord: PropTypes.func.isRequired,
    askToUnpublishWord: PropTypes.func.isRequired,
    enableWord: PropTypes.func.isRequired,
    askToEnableWord: PropTypes.func.isRequired,
    disableWord: PropTypes.func.isRequired,
    askToDisableWord: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchWord(this._getWordPath(newProps));
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {

    if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      this.fetchData(nextProps);
    }
    else if (nextProps.routeParams.word !== this.props.routeParams.word) {
      this.fetchData(nextProps);
    }
    else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
      this.fetchData(nextProps);
    }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  _getWordPath(props = null) {

    if (props == null) {
      props = this.props;
    }

    return props.routeParams.dialect_path + '/Dictionary/' + props.routeParams.word;
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  render() {

    const tabItemStyles = {
      userSelect: 'none'
    }

    const computeEntities = Immutable.fromJS([{
      'id': this._getWordPath(),
      'entity': this.props.computeWord
    },{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }])

    const computeWord = ProviderHelpers.getEntry(this.props.computeWord, this._getWordPath());
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    // Photos
    let photos = [];
    let photosThumbnails = [];

    (selectn('response.contextParameters.word.related_pictures', computeWord) || []).map(function(picture, key) {
      let image = { original: selectn('views[2].url', picture), thumbnail: (selectn('views[0].url', picture) || '/assets/images/cover.png'), description: picture['dc:description'], key: key, id: picture.uid, object: picture };
      photos.push(image);
      photosThumbnails.push(<img key={picture.uid} src={(selectn('views[0].url', picture) || '/assets/images/cover.png')} alt={selectn('title', picture)} style={{margin: '15px', maxWidth: '150px'}} />);
    })

    // Videos
    let videos = [];
    let videoThumbnails = [];

    (selectn('response.contextParameters.word.related_videos', computeWord) || []).map(function(video, key) {
      let vid = { original: ConfGlobal.baseURL + video.path, thumbnail: (selectn('views[0].url', video) || '/assets/images/cover.png'), description: video['dc:description'], key: key, id: video.uid, object: video };
      videos.push(vid);
      videoThumbnails.push(<video key={video.uid} src={ConfGlobal.baseURL + video.path} controls style={{margin: '15px', maxWidth: '150px'}} />);
    })

    // Audio
    let audios = [];

    (selectn('response.contextParameters.word.related_audio', computeWord) || []).map(function(audio, key) {
      audios.push(<Preview styles={{maxWidth: '350px'}} key={selectn('uid', audio)} expandedValue={audio} type="FVAudio" />);
    })

    // Phrases
    let phrases = [];

    (selectn('response.contextParameters.word.related_phrases', computeWord) || []).map(function(phrase, key) {

      const phraseDefinitions = selectn('fv:definitions', phrase);
      const phraseLink = <Link key={selectn('uid', phrase)} href={'/explore' + selectn('path', phrase).replace('Dictionary', 'learn/phrases')}>{selectn('dc:title', phrase)}</Link>;

      if (phraseDefinitions.length == 0) {
        phrases.push(<p key={key}>{phraseLink}</p>);
      } else {
        phrases.push(<SubViewTranslation key={key} group={phraseDefinitions} groupByElement="language" groupValue="translation">
          <p>{phraseLink}</p>
        </SubViewTranslation>);
      }
    })


    let tabs = [];

    if (photos.length > 0) {
      tabs.push(<Tab key="pictures" label="Pictures" >
        <div style={{maxHeight: '400px'}}>
          {photosThumbnails}
        </div>
      </Tab>);
    }

    if (videos.length > 0) {
      tabs.push(<Tab key="videos" label="Videos" >
        <div>
          {videoThumbnails}
        </div>
      </Tab>);
    }

    if (audios.length > 0) {
      tabs.push(<Tab key="audio" label="Audio" >
        <div>
          {audios}
        </div>
      </Tab>);
    }

    if (phrases.length > 0) {
      tabs.push(<Tab key="phrases" label="Phrases" >
        <div>
          {phrases}
        </div>
      </Tab>);
    }

    /**
    * Generate definitions body
    */
    return <DetailsViewWithActions
              labels={{single: "word"}}
              itemPath={this._getWordPath()}
              actions={['workflow', 'edit', 'publish-toggle', 'enable-toggle', 'publish']}
              publishAction={this.props.publishWord}
              unpublishAction={this.props.unpublishWord}
              askToPublishAction={this.props.askToPublishWord}
              askToUnpublishAction={this.props.askToUnpublishWord}
              enableAction={this.props.enableWord}
              askToEnableAction={this.props.askToEnableWord}
              disableAction={this.props.disableWord}
              askToDisableAction={this.props.askToDisableWord}
              deleteAction={this.props.deleteWord}
              onNavigateRequest={this._onNavigateRequest}
              computeItem={computeWord}
              permissionEntry={computeDialect2}
              tabs={tabs} computeEntities={computeEntities} {...this.props}>

            <div className="row">
              <div className="col-xs-12">
                <div>

                  <Card>
                    <CardHeader
                      title={selectn('response.title', computeWord)}
                      subtitle={(selectn('response.contextParameters.word.part_of_speech', computeWord) !=null) ? "Part of Speech: " + selectn('response.contextParameters.word.part_of_speech', computeWord) : ""}
                      avatar={selectn('response.contextParameters.word.related_pictures[0].views[0].url', computeWord)} />

                    <Tabs tabItemContainerStyle={tabItemStyles}>
                      <Tab label="Definition" >
                        <div>
                          <CardText>

                            <div className="col-xs-8">

                              <h2>{selectn('response.title', computeWord)}</h2>

                              <p>Part of Speech: {selectn('response.contextParameters.word.part_of_speech', computeWord)}</p>

                              <p>Pronunciation: {selectn('response.properties.fv-word:pronunciation', computeWord)}</p>

                              <h3>Audio</h3>

                              <div>{(audios.length === 0) ? <span>No audio is available yet.</span> : audios}</div>

                              <SubViewTranslation group={selectn('response.properties.fv:definitions', computeWord)} groupByElement="language" groupValue="translation">
                                <p>Definitions:</p>
                              </SubViewTranslation>

                              <SubViewTranslation group={selectn('response.properties.fv:literal_translation', computeWord)} groupByElement="language" groupValue="translation">
                                <p>Literal Translations:</p>
                              </SubViewTranslation>

                              {(() => {
                                  if (phrases.length > 0) {
                                    return <div>
                                      <h3>Related Phrases:</h3>
                                      {phrases}
                                    </div>;
                                  }
                              })()}

                            </div>

                            <div className="col-xs-4">

                              <MediaPanel label="Photo(s)" type="FVPicture" items={photos} />
                              <MediaPanel label="Video(s)" type="FVVideo" items={videos} />

                            </div>

                          </CardText>
                        </div>
                      </Tab>
                      <Tab label="Metadata" id="metadata">
                        <div>
                          <CardText>
                            <h2>Metadata</h2>
                            <div className="row">
                              {(selectn('response', computeWord)) ? <MetadataPanel computeEntity={computeWord} /> : ''}
                            </div>
                          </CardText>
                        </div>
                      </Tab>
                    </Tabs>

                  </Card>

                </div>
              </div>
            </div>
        </DetailsViewWithActions>;
  }
}