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
import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import {
  askToDisablePhrase,
  askToEnablePhrase,
  askToPublishPhrase,
  askToUnpublishPhrase,
  deletePhrase,
  disablePhrase,
  enablePhrase,
  fetchPhrase,
  publishPhrase,
  unpublishPhrase,
} from 'providers/redux/reducers/fvPhrase'
import { changeTitleParams, overrideBreadcrumbs } from 'providers/redux/reducers/navigation'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'

import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import MetadataPanel from 'views/pages/explore/dialect/learn/base/metadata-panel'
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel'
import SubViewTranslation from 'views/pages/explore/dialect/learn/base/subview-translation'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import TextHeader from 'views/components/Document/Typography/text-header'

//import Header from 'views/pages/explore/dialect/header';
//import PageHeader from 'views/pages/explore/dialect/page-header';

import Tab from 'material-ui/lib/tabs/tab'
import '!style-loader!css-loader!react-image-gallery/build/image-gallery.css'

import withActions from 'views/hoc/view/with-actions'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const DetailsViewWithActions = withActions(PromiseWrapper, true)

/**
 * View phrase entry
 */

const { array, func, object, string } = PropTypes
export class View extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computePhrase: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    askToDisablePhrase: func.isRequired,
    askToEnablePhrase: func.isRequired,
    askToPublishPhrase: func.isRequired,
    askToUnpublishPhrase: func.isRequired,
    changeTitleParams: func.isRequired,
    deletePhrase: func.isRequired,
    disablePhrase: func.isRequired,
    enablePhrase: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchPhrase: func.isRequired,
    overrideBreadcrumbs: func.isRequired,
    publishPhrase: func.isRequired,
    pushWindowPath: func.isRequired,
    unpublishPhrase: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      deleteDialogOpen: false,
    }

    // Bind methods to 'this'
    ;['_onNavigateRequest'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    newProps.fetchPhrase(this._getPhrasePath(newProps))
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      this.fetchData(nextProps)
    } else if (nextProps.routeParams.phrase !== this.props.routeParams.phrase) {
      this.fetchData(nextProps)
    }
    // else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
    //     this.fetchData(nextProps);
    // }
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  componentDidUpdate(/*prevProps, prevState*/) {
    const phrase = selectn('response', ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath()))
    const title = selectn('properties.dc:title', phrase)
    const uid = selectn('uid', phrase)

    if (title && selectn('pageTitleParams.phrase', this.props.properties) !== title) {
      this.props.changeTitleParams({ phrase: title })
      this.props.overrideBreadcrumbs({ find: uid, replace: 'pageTitleParams.phrase' })
    }
  }

  _getPhrasePath(props = null) {
    const _props = props === null ? this.props : props
    if (StringHelpers.isUUID(_props.routeParams.phrase)) {
      return _props.routeParams.phrase
    }
    return _props.routeParams.dialect_path + '/Dictionary/' + StringHelpers.clean(_props.routeParams.phrase)
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this._getPhrasePath(),
        entity: this.props.computePhrase,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computePhrase = ProviderHelpers.getEntry(this.props.computePhrase, this._getPhrasePath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Photos
    const photos = []
    const photosThumbnails = []
    const photoData = selectn('response.contextParameters.phrase.related_pictures', computePhrase) || []
    photoData.map((picture, key) => {
      const image = {
        original: selectn('views[2].url', picture),
        thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
        description: picture['dc:description'],
        key: key,
        id: picture.uid,
        object: picture,
      }
      photos.push(image)
      photosThumbnails.push(
        <img
          key={picture.uid}
          src={selectn('views[0].url', picture) || 'assets/images/cover.png'}
          alt={selectn('title', picture)}
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })

    // Videos
    const videos = []
    const videoThumbnails = []
    const videoData = selectn('response.contextParameters.phrase.related_videos', computePhrase) || []
    videoData.map((video, key) => {
      const vid = {
        original: NavigationHelpers.getBaseURL() + video.path,
        thumbnail: selectn('views[0].url', video) || 'assets/images/cover.png',
        description: video['dc:description'],
        key: key,
        id: video.uid,
        object: video,
      }
      videos.push(vid)
      videoThumbnails.push(
        <video
          key={video.uid}
          src={NavigationHelpers.getBaseURL() + video.path}
          controls
          style={{ margin: '15px', maxWidth: '150px' }}
        />
      )
    })

    // Audio
    const audios = []
    const audioData = selectn('response.contextParameters.phrase.related_audio', computePhrase) || []
    audioData.map((audio) => {
      audios.push(
        <Preview styles={{ maxWidth: '350px' }} key={selectn('uid', audio)} expandedValue={audio} type="FVAudio" />
      )
    })

    const tabs = []

    if (photos.length > 0) {
      tabs.push(
        <Tab key="pictures" label={intl.trans('pictures', 'Pictures', 'first')}>
          <div style={{ maxHeight: '400px' }}>{photosThumbnails}</div>
        </Tab>
      )
    }

    if (videos.length > 0) {
      tabs.push(
        <Tab key="videos" label={intl.trans('videos', 'Videos', 'first')}>
          <div>{videoThumbnails}</div>
        </Tab>
      )
    }

    if (audios.length > 0) {
      tabs.push(
        <Tab key="audio" label={intl.trans('audio', 'Audio', 'first')}>
          <div>{audios}</div>
        </Tab>
      )
    }

    // Categories
    const phrase_books = []
    const phraseBookData = selectn('response.contextParameters.phrase.phrase_books', computePhrase) || []
    phraseBookData.map((phrase_book, key) => {
      phrase_books.push(<span key={key}>{selectn('dc:title', phrase_book)}</span>)
    })
    // Cultural notes
    const cultural_notes = []
    const culturalNotesData = selectn('response.properties.fv:cultural_note', computePhrase) || []
    culturalNotesData.map((cultural_note, key) => {
      cultural_notes.push(<div key={key}>{intl.searchAndReplace(cultural_note)}</div>)
    })

    const dialectClassName = getDialectClassname(computeDialect2)

    /**
     * Generate definitions body
     */
    return (
      <DetailsViewWithActions
        labels={{ single: 'phrase' }}
        itemPath={this._getPhrasePath()}
        actions={['workflow', 'edit', 'publish-toggle', 'enable-toggle', 'publish']}
        publishAction={this.props.publishPhrase}
        unpublishAction={this.props.unpublishPhrase}
        askToPublishAction={this.props.askToPublishPhrase}
        askToUnpublishAction={this.props.askToUnpublishPhrase}
        enableAction={this.props.enablePhrase}
        askToEnableAction={this.props.askToEnablePhrase}
        disableAction={this.props.disablePhrase}
        askToDisableAction={this.props.askToDisablePhrase}
        deleteAction={this.props.deletePhrase}
        onNavigateRequest={this._onNavigateRequest}
        computeItem={computePhrase}
        permissionEntry={computeDialect2}
        tabs={tabs}
        computeEntities={computeEntities}
        {...this.props}
      >
        <div className="row" style={{ marginTop: '15px' }}>
          <div className={classNames('col-xs-12', 'col-md-7')}>
            <div>
              <div className={dialectClassName}>
                <TextHeader
                  title={selectn('response.title', computePhrase)}
                  tag="h1"
                  properties={this.props.properties}
                />
              </div>
              <hr />

              {(() => {
                if (phrase_books.length > 0) {
                  return (
                    <span>
                      <strong>{intl.trans('phrase_books', 'Phrase Books', 'words')}</strong>: {phrase_books}
                    </span>
                  )
                }
              })()}

              <SubViewTranslation
                group={selectn('response.properties.fv:definitions', computePhrase)}
                groupByElement="language"
                groupValue="translation"
              >
                <p>
                  <strong>{intl.trans('definitions', 'Definitions', 'first')}:</strong>
                </p>
              </SubViewTranslation>

              <SubViewTranslation
                group={selectn('response.properties.fv:literal_translation', computePhrase)}
                groupByElement="language"
                groupValue="translation"
              >
                <p>
                  <strong>{intl.trans('literal_translations', 'Literal Translations', 'words')}:</strong>
                </p>
              </SubViewTranslation>

              {(() => {
                if (cultural_notes.length > 0) {
                  return (
                    <div style={{ margin: '10px 0' }}>
                      <hr />
                      <p>
                        <strong>
                          {intl.trans(
                            'views.pages.explore.dialect.learn.words.cultural_notes',
                            'Cultural Notes',
                            'words'
                          )}
                          :
                        </strong>
                      </p>
                      {cultural_notes}
                    </div>
                  )
                }
              })()}

              <hr />

              {selectn('response', computePhrase) ? (
                <MetadataPanel properties={this.props.properties} computeEntity={computePhrase} />
              ) : (
                ''
              )}
            </div>
          </div>

          <div className={classNames('col-xs-12', 'col-md-3')}>
            <h3>{intl.trans('audio', 'Audio', 'upper')}</h3>
            <div>
              {audios.length === 0 ? (
                <span>
                  {intl.trans(
                    'views.pages.explore.dialect.learn.words.no_audio_yet',
                    'No audio is available yet',
                    'first'
                  )}
                  .
                </span>
              ) : (
                audios
              )}
            </div>

            <MediaPanel label={intl.trans('photo_s', 'PHOTO(s)', 'upper')} type="FVPicture" items={photos} />
            <MediaPanel label={intl.trans('video_s', 'VIDEO(s)', 'upper')} type="FVVideo" items={videos} />
          </div>
        </div>
      </DetailsViewWithActions>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect, fvPhrase, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { computePhrase } = fvPhrase
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeDialect2,
    computeLogin,
    computePhrase,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  askToDisablePhrase,
  askToEnablePhrase,
  askToPublishPhrase,
  askToUnpublishPhrase,
  changeTitleParams,
  deletePhrase,
  disablePhrase,
  enablePhrase,
  fetchDialect2,
  fetchPhrase,
  overrideBreadcrumbs,
  publishPhrase,
  pushWindowPath,
  unpublishPhrase,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
