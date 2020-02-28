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
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// REDUX
import { connect } from 'react-redux'
import Immutable from 'immutable'
import { createLabel, fetchLabel, updateLabel } from 'providers/redux/reducers/fvLabel'
import { fetchDialect, fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
import { Document } from 'nuxeo'
import ProviderHelpers from 'common/ProviderHelpers'

import { withMobileDialog, Dialog } from '@material-ui/core'

import ModalContent from './modalContent'

/**
 * List view for words in immersion
 */
const { bool, func, object, string } = PropTypes

class LabelModal extends Component {
  static propTypes = {
    fullscreen: bool.isRequired,
    open: bool,
    handleClose: func,
    label: object,
    dialectPath: string,
    isNew: bool.isRequired,
    // REDUX: actions/dispatch/func
    computeDialect2: object.isRequired,
    computeLabel: object.isRequired,
    createLabel: func.isRequired,
    fetchLabel: func.isRequired,
    updateLabel: func.isRequired,
  }
  static defaultProps = {
    fullscreen: false,
    isNew: false,
  }

  constructor(props, context) {
    super(props, context)

    this.audioRef = React.createRef()
    this.dictionaryPath = this.props.dialectPath + '/Label Dictionary'
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (!prevProps.label && this.props.label && !this.props.isNew) {
      this.props.fetchLabel(this.props.label.uid)
      this.props.fetchDialect(`/${this.props.dialectPath}`)
      this.props.fetchDialect2(this.props.dialectPath)
    }
  }

  handleCreateSave = (translation) => {
    const { label, createLabel, handleClose } = this.props

    const now = Date.now()

    const relatedAudioValue = this.audioRef.current.getValue()
    const relatedAudio = relatedAudioValue ? relatedAudioValue['fv:related_audio'] : null

    createLabel(
      this.dictionaryPath,
      {
        type: 'FVLabel',
        name: now.toString(),
        properties: {
          'dc:title': translation.join(''),
          'fvlabel:labelKey': label.labelKey,
          'fv:related_audio': relatedAudio,
        },
      },
      null,
      now
    ).then(() => {
      setTimeout(handleClose(true), 500)
    })
  }

  handleEditSave = (translation) => {
    const { label, updateLabel, computeLabel, handleClose } = this.props
    const computeEntities = Immutable.fromJS([
      {
        id: label.uid,
        entity: computeLabel,
      },
    ])

    const item = computeEntities.find((value) => value.get('id') === label.uid)

    const word = ProviderHelpers.getEntry(item.get('entity'), label.uid)

    const newDocument = new Document(word.response, {
      repository: word.response._repository,
      nuxeo: word.response._nuxeo,
    })

    const relatedAudioValue = this.audioRef.current.getValue()
    const relatedAudio = relatedAudioValue ? relatedAudioValue['fv:related_audio'] : null

    newDocument.set({ 'dc:title': translation.join(''), 'fv:related_audio': relatedAudio })

    updateLabel(newDocument, null, null).then(() => {
      setTimeout(handleClose(true), 500)
    })
  }

  renderContent = () => {
    const { isNew, label, handleClose, dialectPath } = this.props
    return label ? (
      <ModalContent
        handleClose={() => handleClose()}
        handleSave={(translation) => (isNew ? this.handleCreateSave(translation) : this.handleEditSave(translation))}
        label={label}
        type={isNew ? 'base' : 'translation'}
        audioRef={this.audioRef}
        dialectPath={dialectPath}
      />
    ) : (
      <div />
    )
  }

  render() {
    const { fullScreen, open, handleClose, label, computeLabel, isNew, dialectPath, computeDialect2 } = this.props
    const computeEntities = label
      ? Immutable.fromJS([
          {
            id: label.uid,
            entity: computeLabel,
          },
          {
            id: dialectPath,
            entity: computeDialect2,
          },
        ])
      : null
    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={() => handleClose()}
          aria-labelledby="responsive-dialog-title"
          scroll="body"
        >
          {label ? (
            <>
              {isNew ? (
                this.renderContent()
              ) : (
                <PromiseWrapper computeEntities={computeEntities}>{this.renderContent()}</PromiseWrapper>
              )}
            </>
          ) : (
            <div />
          )}
        </Dialog>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvLabel, fvDialect } = state

  const { computeDialect2 } = fvDialect
  const { computeLabel } = fvLabel
  return {
    computeLabel,
    computeDialect2,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createLabel,
  fetchLabel,
  updateLabel,
  fetchDialect,
  fetchDialect2,
}

export default withMobileDialog()(connect(mapStateToProps, mapDispatchToProps)(LabelModal))
