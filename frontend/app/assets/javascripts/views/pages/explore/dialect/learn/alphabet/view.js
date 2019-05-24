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
import Immutable, { Map } from 'immutable'
import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchCharacter, publishCharacter } from 'providers/redux/reducers/fvCharacter'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { deleteWord } from 'providers/redux/reducers/fvWord'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import NavigationHelpers from 'common/NavigationHelpers'
import UIHelpers from 'common/UIHelpers'

import Preview from 'views/components/Editor/Preview'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import MediaPanel from 'views/pages/explore/dialect/learn/base/media-panel'
import PageToolbar from 'views/pages/explore/dialect/page-toolbar'
import SubViewTranslation from 'views/pages/explore/dialect/learn/base/subview-translation'

import { Link } from 'provide-page'

import Card from 'material-ui/lib/card/card'
import CardText from 'material-ui/lib/card/card-text'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import WordListView from 'views/pages/explore/dialect/learn/words/list-view'
import PhraseListView from 'views/pages/explore/dialect/learn/phrases/list-view'

import '!style-loader!css-loader!react-image-gallery/build/image-gallery.css'
import IntlService from 'views/services/intl'
const intl = IntlService.instance
/**
 * View character entry
 */

const { array, func, object, string } = PropTypes
export class View extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    // REDUX: reducers/state
    computeCharacter: object.isRequired,
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    deleteWord: func.isRequired,
    fetchCharacter: func.isRequired,
    fetchDialect2: func.isRequired,
    publishCharacter: func.isRequired,
    pushWindowPath: func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      deleteDialogOpen: false,
    }

    // Bind methods to 'this'
    ;['_handleConfirmDelete', '_onNavigateRequest', '_publishChangesAction'].forEach(
      (method) => (this[method] = this[method].bind(this))
    )
  }

  fetchData(newProps) {
    newProps.fetchCharacter(this._getCharacterPath(newProps))
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.dialect_path !== this.props.routeParams.dialect_path) {
      this.fetchData(nextProps)
    } else if (nextProps.routeParams.word !== this.props.routeParams.word) {
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

  _getCharacterPath(props = null) {
    const _props = props === null ? this.props : props

    return _props.routeParams.dialect_path + '/Alphabet/' + _props.routeParams.character
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path)
  }

  _handleConfirmDelete(item /*, event*/) {
    this.props.deleteWord(item.uid)
    this.setState({ deleteDialogOpen: false })
  }

  /**
   * Publish changes
   */
  _publishChangesAction() {
    this.props.publishCharacter(
      this._getCharacterPath(),
      null,
      null,
      intl.trans(
        'views.pages.explore.dialect.learn.alphabet.character_published_success',
        'Character published successfully!',
        'first'
      )
    )
  }

  render() {
    const tabItemStyles = {
      userSelect: 'none',
    }

    const computeEntities = Immutable.fromJS([
      {
        id: this._getCharacterPath(),
        entity: this.props.computeCharacter,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeCharacter = ProviderHelpers.getEntry(this.props.computeCharacter, this._getCharacterPath())
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Generate photos
    const photos = []
    ;(selectn('response.contextParameters.word.related_pictures', computeCharacter) || []).map((picture, key) => {
      const image = {
        original: selectn('views[2].url', picture),
        thumbnail: selectn('views[0].url', picture) || 'assets/images/cover.png',
        description: picture['dc:description'],
        key: key,
        id: picture.uid,
        object: picture,
      }
      photos.push(image)
    })

    // Generate videos
    const videos = []
    ;(selectn('response.contextParameters.word.related_videos', computeCharacter) || []).map((video, key) => {
      const vid = {
        original: NavigationHelpers.getBaseURL() + video.path,
        thumbnail: selectn('views[0].url', video) || 'assets/images/cover.png',
        description: video['dc:description'],
        key: key,
        id: video.uid,
        object: video,
      }
      videos.push(vid)
    })

    const currentAppliedFilter = new Map({
      currentAppliedFilter: new Map({
        startsWith: " AND dc:title LIKE '" + selectn('response.title', computeCharacter) + "%'",
      }),
    })

    /**
     * Generate definitions body
     */
    return (
      <PromiseWrapper computeEntities={computeEntities}>
        {(() => {
          if (this.props.routeParams.area === 'Workspaces') {
            if (selectn('response', computeCharacter))
              return (
                <PageToolbar
                  label={intl.trans('character', 'Character', 'first')}
                  handleNavigateRequest={this._onNavigateRequest}
                  computeEntity={computeCharacter}
                  computePermissionEntity={computeDialect2}
                  computeLogin={this.props.computeLogin}
                  actions={['edit', 'publish']}
                  publishChangesAction={this._publishChangesAction}
                  {...this.props}
                />
              )
          }
        })()}

        <div className="row">
          <div className="col-xs-12">
            <div>
              <Card>
                <Tabs tabItemContainerStyle={tabItemStyles}>
                  <Tab label={intl.trans('definition', 'Definition', 'first')}>
                    <div>
                      <CardText>
                        <div className="col-xs-8">
                          <h2>{selectn('response.title', computeCharacter)}</h2>

                          <div className="row">
                            <div className={classNames('col-md-6', 'col-xs-12')}>
                              <h3>{intl.trans('audio', 'Audio', 'first')}</h3>

                              <div>
                                {selectn(
                                  'response.contextParameters.character.related_audio.length',
                                  computeCharacter
                                ) === 0 ? (
                                  <span>
                                    {intl.trans(
                                      'views.pages.explore.dialect.learn.words.no_audio_yet',
                                      'No audio is available yet',
                                      'first'
                                    )}
                                    .
                                  </span>
                                ) : (
                                  ''
                                )}

                                {(
                                  selectn('response.contextParameters.character.related_audio', computeCharacter) || []
                                ).map((audio /*, key*/) => {
                                  return (
                                    <Preview
                                      styles={{ maxWidth: '350px' }}
                                      key={selectn('uid', audio)}
                                      expandedValue={audio}
                                      type="FVAudio"
                                    />
                                  )
                                })}
                              </div>
                            </div>

                            <div className={classNames('col-md-6', 'col-xs-12')}>
                              {(() => {
                                if (
                                  selectn(
                                    'response.contextParameters.character.related_words.length',
                                    computeCharacter
                                  ) > 0
                                ) {
                                  return (
                                    <div>
                                      <h3>{intl.trans('related_words', 'Related Words', 'words')}:</h3>

                                      {(
                                        selectn(
                                          'response.contextParameters.character.related_words',
                                          computeCharacter
                                        ) || []
                                      ).map((word, key) => {
                                        const wordItem =
                                          selectn('fv:definitions.length', word) > 0
                                            ? selectn('fv:definitions', word)
                                            : selectn('fv:literal_translation', word)

                                        return (
                                          <SubViewTranslation
                                            key={key}
                                            group={wordItem}
                                            groupByElement="language"
                                            groupValue="translation"
                                          >
                                            <p>
                                              <Link
                                                key={selectn('uid', word)}
                                                href={NavigationHelpers.navigate(
                                                  '/explore' +
                                                    selectn('path', word).replace('/Dictionary/', '/learn/words/'),
                                                  null,
                                                  true
                                                )}
                                              >
                                                {selectn('dc:title', word)}
                                              </Link>
                                            </p>
                                          </SubViewTranslation>
                                        )
                                      })}
                                    </div>
                                  )
                                }
                              })()}
                            </div>
                          </div>
                        </div>

                        <div className="col-xs-4">
                          <MediaPanel
                            label={intl.trans('photo_s', 'Photo(s)', 'first')}
                            type="FVPicture"
                            items={photos}
                          />
                          <MediaPanel
                            label={intl.trans('video_s', 'Video(s)', 'first')}
                            type="FVVideo"
                            items={videos}
                          />
                        </div>
                      </CardText>
                    </div>
                  </Tab>
                  <Tab
                    label={
                      UIHelpers.isViewSize('xs')
                        ? intl.trans('words', 'Words', 'first')
                        : intl.trans(
                            'views.pages.explore.dialect.learn.alphabet.words_starting_with_x',
                            'Words Starting with ' + selectn('response.title', computeCharacter),
                            'words',
                            [selectn('response.title', computeCharacter)]
                          )
                    }
                    id="find_words"
                  >
                    <div>
                      <CardText>
                        <h2>
                          {intl.trans(
                            'views.pages.explore.dialect.learn.alphabet.words_starting_with_x',
                            'Words Starting with ' + selectn('response.title', computeCharacter),
                            'words',
                            [selectn('response.title', computeCharacter)]
                          )}
                        </h2>
                        <div className="row">
                          <WordListView
                            dialect={selectn('response', computeDialect2)}
                            filter={currentAppliedFilter}
                            routeParams={this.props.routeParams}
                          />
                        </div>
                      </CardText>
                    </div>
                  </Tab>
                  <Tab
                    label={
                      UIHelpers.isViewSize('xs')
                        ? intl.trans('phrases', 'Phrases', 'first')
                        : intl.trans(
                            'views.pages.explore.dialect.learn.alphabet.phrases_starting_with_x',
                            'Phrases Starting with ' + selectn('response.title', computeCharacter),
                            'words',
                            [selectn('response.title', computeCharacter)]
                          )
                    }
                    id="find_phrases"
                  >
                    <div>
                      <CardText>
                        <h2>
                          {intl.trans(
                            'views.pages.explore.dialect.learn.alphabet.phrases_starting_with_x',
                            'Phrases Starting with ' + selectn('response.title', computeCharacter),
                            'words',
                            [selectn('response.title', computeCharacter)]
                          )}
                        </h2>
                        <div className="row">
                          <PhraseListView
                            dialect={selectn('response', computeDialect2)}
                            filter={currentAppliedFilter}
                            routeParams={this.props.routeParams}
                          />
                        </div>
                      </CardText>
                    </div>
                  </Tab>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvCharacter, fvDialect, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeCharacter } = fvCharacter
  const { computeLogin } = nuxeo
  const { computeDialect2 } = fvDialect
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeCharacter,
    computeDialect2,
    computeLogin,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  deleteWord,
  fetchCharacter,
  fetchDialect2,
  publishCharacter,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(View)
