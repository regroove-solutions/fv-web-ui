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
import classNames from 'classnames'
import selectn from 'selectn'

import DOMPurify from 'dompurify'

import ConfGlobal from 'conf/local.json'

import UIHelpers from 'common/UIHelpers'
import AVPlayArrow from 'material-ui/lib/svg-icons/av/play-arrow'
import AVStop from 'material-ui/lib/svg-icons/av/stop'

import Card from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import CardMedia from 'material-ui/lib/card/card-media'
import CardText from 'material-ui/lib/card/card-text'

import FlatButton from 'material-ui/lib/flat-button'
import IconButton from 'material-ui/lib/icon-button'

import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import IntlService from 'views/services/intl'

const intl = IntlService.instance

class Introduction extends Component {
  static propTypes = {
    defaultLanguage: PropTypes.any, // TODO: set correct type
    style: PropTypes.any, // TODO: set correct type
    item: PropTypes.any, // TODO: set correct type
    audio: PropTypes.any, // TODO: set correct type
  }
  static defaultProps = {
    style: {},
  }
  render() {
    const DEFAULT_LANGUAGE = this.props.defaultLanguage
    const introduction = selectn('properties.fvbook:introduction', this.props.item)
    const introductionTranslations = selectn('properties.fvbook:introduction_literal_translation', this.props.item)
    const introductionDiv = (
      <div
        className="IntroductionTab"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(introduction) }}
        style={this.props.style}
      />
    )

    if (!introductionTranslations || introductionTranslations.length === 0) {
      if (!introduction) {
        return null
      }

      return (
        <div className="IntroductionTranslations">
          <div>
            <h1 className="IntroductionTitle">
              {intl.trans('introduction', 'Introduction', 'first')} {this.props.audio}
            </h1>
          </div>
          {introductionDiv}
        </div>
      )
    }

    return (
      <Tabs>
        <Tab label={intl.trans('introduction', 'Introduction', 'first')}>{introductionDiv}</Tab>
        <Tab label={intl.searchAndReplace(DEFAULT_LANGUAGE)}>
          <div className="IntroductionTab" style={this.props.style}>
            {introductionTranslations.map(function introductionTranslationsMapper(translation, i) {
              if (translation.language === DEFAULT_LANGUAGE) {
                return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translation.translation) }} key={i} />
              }
            })}
          </div>
        </Tab>
      </Tabs>
    )
  }
}

class CardView extends Component {
  static propTypes = {
    action: PropTypes.func,
    item: PropTypes.any, // TODO: set correct type
    defaultLanguage: PropTypes.any, // TODO: set correct type
    style: PropTypes.any, // TODO: set correct type
    cols: PropTypes.any, // TODO: set correct type
  }
  static defaultProps = {
    action: () => {},
    style: {},
  }
  constructor(props, context) {
    super(props, context)

    this.state = {
      showIntro: false,
    }
  }

  render() {
    let audioIcon = null
    let audioCallback = null

    const DEFAULT_LANGUAGE = this.props.defaultLanguage

    const mediumImage = selectn('contextParameters.book.related_pictures[0].views[2]', this.props.item)
    const coverImage = selectn('url', mediumImage) || '/assets/images/cover.png'
    const audioObj = selectn('contextParameters.book.related_audio[0].path', this.props.item)

    if (audioObj) {
      const stateFunc = function stateFunc(state) {
        this.setState(state)
      }.bind(this)

      const isStopped = decodeURIComponent(selectn('src', this.state.nowPlaying)) !== ConfGlobal.baseURL + audioObj
      audioIcon = isStopped ? (
        <AVPlayArrow style={{ marginRight: '10px' }} />
      ) : (
        <AVStop style={{ marginRight: '10px' }} />
      )
      audioCallback = isStopped
        ? UIHelpers.playAudio.bind(this, this.state, stateFunc, ConfGlobal.baseURL + audioObj)
        : UIHelpers.stopAudio.bind(this, this.state, stateFunc)
    }

    // Translated 'continue' label
    const entryType = selectn('properties.fvbook:type', this.props.item)
    const translatedContinueLabelKey =
      'views.pages.explore.dialect.learn.songs_stories.continue_to_' + (entryType ? entryType : 'x')

    const translatedContinueLabel = intl.trans(
      translatedContinueLabelKey,
      'Continue to ' + (entryType ? intl.searchAndReplace(entryType) : 'Entry'),
      'first',
      [entryType ? intl.searchAndReplace(entryType) : intl.trans('entry', 'Entry', 'first')]
    )
    const title = <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(this.props.item.title) }} />
    const subtitle = (selectn('properties.fvbook:title_literal_translation', this.props.item) || []).map(
      (translation, i) => {
        if (translation.language === DEFAULT_LANGUAGE) {
          return <span key={i}>{translation.translation}</span>
        }
      }
    )
    const cardViewTitle = <CardTitle titleStyle={{ fontSize: '19px' }} title={title} subtitle={subtitle} />
    const cardViewPopover = (
      <div
        className="CardViewPopover"
        style={{
          zIndex: this.state.showIntro ? 2 : -1,
          width: '95%',
          minWidth: 'auto',
        }}
      >
        <IconButton
          className="CardViewPopoverClose"
          style={{ position: 'absolute' }}
          iconClassName="material-icons"
          onTouchTap={() => this.setState({ showIntro: false })}
        >
          clear
        </IconButton>

        {selectn('properties.fvbook:introduction', this.props.item) && (
          <Introduction
            {...this.props}
            audio={
              audioIcon ? (
                <IconButton
                  style={{ verticalAlign: 'middle', padding: '0', width: '25px', height: '25px' }}
                  iconStyle={{ width: '25px', height: '25px' }}
                  onTouchTap={audioCallback}
                >
                  {audioIcon}
                </IconButton>
              ) : null
            }
          />
        )}
      </div>
    )
    const CardClasses = classNames({
      CardView: true,
      'col-xs-12': true,
      [`col-md-${Math.ceil(12 / this.props.cols)}`]: true,
    })
    return (
      <div key={this.props.item.uid} className={CardClasses} style={this.props.style}>
        <Card className="CardViewCard">
          <CardMedia overlay={cardViewTitle}>
            <div
              className="CardViewMedia"
              style={{
                backgroundSize: selectn('width', mediumImage) > 200 ? '100%' : 'cover',
                backgroundImage: `url('${coverImage}?inline=true')`,
              }}
            />
            {cardViewPopover}
          </CardMedia>

          <CardText className="CardViewCardText">
            <FlatButton
              onTouchTap={this.props.action.bind(this, this.props.item)}
              primary
              label={translatedContinueLabel}
            />
            {selectn('properties.fvbook:introduction', this.props.item) && (
              <IconButton
                className="test"
                iconClassName="material-icons"
                style={{
                  padding: '5px',
                  width: 'auto',
                  height: 'auto',
                }}
                tooltipPosition="top-left"
                onTouchTap={() => this.setState({ showIntro: !this.state.showIntro })}
                touch
              >
                flip_to_front
              </IconButton>
            )}
          </CardText>
        </Card>
      </div>
    )
  }
}

export { Introduction, CardView }
