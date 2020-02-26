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
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (!prevProps.label && this.props.label && !this.props.isNew) {
      this.props.fetchLabel(this.props.label.uid)
    }
  }

  handleCreateSave = (translation) => {
    const { label, createLabel, handleClose, dialectPath } = this.props

    const now = Date.now()

    createLabel(
      dialectPath,
      {
        type: 'FVLabel',
        name: now.toString(),
        properties: {
          'dc:title': translation.join(''),
          'fvlabel:labelKey': label.labelKey,
        },
      },
      null,
      now
    ).then(() => {
      handleClose(true)
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

    newDocument.set({ 'dc:title': translation.join('') })

    updateLabel(newDocument, null, null).then(() => {
      handleClose(true)
    })
  }

  renderContent = () => {
    const { isNew, label, handleClose } = this.props
    return label ? (
      <ModalContent
        handleClose={() => handleClose()}
        handleSave={(translation) => (isNew ? this.handleCreateSave(translation) : this.handleEditSave(translation))}
        label={label}
        type={isNew ? 'base' : 'translation'}
      />
    ) : (
      <div />
    )
  }

  render() {
    const { fullScreen, open, handleClose, label, computeLabel, isNew } = this.props
    const computeEntities = label
      ? Immutable.fromJS([
          {
            id: label.uid,
            entity: computeLabel,
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
          scroll="paper"
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
  const { fvLabel } = state

  const { computeLabel } = fvLabel
  return {
    computeLabel,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createLabel,
  fetchLabel,
  updateLabel,
}

export default withMobileDialog()(connect(mapStateToProps, mapDispatchToProps)(LabelModal))
